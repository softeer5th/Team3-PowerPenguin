package com.softeer.reacton.global.oauth;

import com.softeer.reacton.domain.professor.Professor;
import com.softeer.reacton.domain.professor.ProfessorRepository;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.GlobalErrorCode;
import com.softeer.reacton.global.exception.code.OAuthErrorCode;
import com.softeer.reacton.global.jwt.JwtTokenUtil;
import com.softeer.reacton.global.oauth.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class OAuthService {

    private final OAuthConfig oauthConfig;
    private final JwtTokenUtil jwtTokenUtil;
    private final ProfessorRepository professorRepository;
    private final WebClient webClient;

    public String getOauthLoginUrl(String providerName) {
        log.debug("OAuth 로그인 URL을 생성합니다.");

        OAuthProvider provider = oauthConfig.getProvider(providerName);
        StringBuilder urlBuilder = new StringBuilder(provider.getLoginUrl());

        urlBuilder.append("?scope=").append(URLEncoder.encode(provider.getScope(), StandardCharsets.UTF_8))
                .append("&client_id=").append(provider.getClientId())
                .append("&redirect_uri=").append(URLEncoder.encode(provider.getRedirectUri(), StandardCharsets.UTF_8))
                .append("&response_type=code");

        return urlBuilder.toString();
    }

    public OAuthLoginResult processOauthLogin(String providerName, String code) {
        log.debug("OAuth 로그인을 진행합니다.");

        OAuthProvider provider = oauthConfig.getProvider(providerName);

        OAuthTokenResponse tokenResponse = getAuthAccessTokenByOauth(code, provider);
        UserProfile userProfile = getUserProfile(providerName, provider, tokenResponse);

        Optional<Professor> existingUser = professorRepository.findByOauthId(userProfile.getOauthId());

        existingUser.ifPresent(professor -> {
            if (!professor.getEmail().equals(userProfile.getEmail())) {
                log.debug("사용자 이메일 주소를 변경합니다. : oldEmail = {}, newEmail = {}", professor.getEmail(), userProfile.getEmail());

                professor.updateEmail(userProfile.getEmail());
                professorRepository.save(professor);

                log.debug("사용자 이메일 주소를 변경했습니다.");
            }
        });

        boolean isSignedUp = existingUser.isPresent();
        String accessToken = isSignedUp
                ? jwtTokenUtil.createAuthAccessToken(userProfile.getOauthId(), userProfile.getEmail())
                : jwtTokenUtil.createSignUpToken(userProfile.getOauthId(), userProfile.getEmail());

        log.info("OAuth 로그인이 완료되었습니다.");

        return new OAuthLoginResult(accessToken, isSignedUp);
    }

    private OAuthTokenResponse getAuthAccessTokenByOauth(String code, OAuthProvider provider) {
        log.debug("OAuth access 토큰을 요청합니다.");

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();

        formData.add("code", code);
        formData.add("client_id", provider.getClientId());
        formData.add("client_secret", provider.getClientSecret());
        formData.add("redirect_uri", provider.getRedirectUri());
        formData.add("grant_type", "authorization_code");

        try {
            return webClient.post()
                    .uri(provider.getTokenUri())
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                    .bodyValue(formData)
                    .retrieve()
                    .bodyToMono(OAuthTokenResponse.class)
                    .block();
        } catch (WebClientResponseException e) {
            log.error("OAuth access 토큰을 요청하는 과정에서 발생한 에러입니다. : {}", e.getMessage());
            throw new BaseException(GlobalErrorCode.SERVER_ERROR);
        }
    }

    private UserProfile getUserProfile(String providerName, OAuthProvider provider, OAuthTokenResponse tokenResponse) {
        log.debug("OAuth 사용자 정보를 가져옵니다.");

        if ("google".equals(providerName)) {
            return webClient.get()
                    .uri(provider.getUserInfoUri())
                    .headers(header -> header.setBearerAuth(tokenResponse.getAccessToken()))
                    .retrieve()
                    .bodyToMono(GoogleUserProfile.class)
                    .block();
        }

        log.warn("OAuth 사용자 정보를 가져오는 과정에서 발생한 에러입니다. : OAuth provider '{}' not found", providerName);
        throw new BaseException(OAuthErrorCode.UNSUPPORTED_OAUTH_PROVIDER);
    }
}
