package com.softeer.reacton.global.oauth;

import com.softeer.reacton.domain.professor.Professor;
import com.softeer.reacton.domain.professor.ProfessorRepository;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.GlobalErrorCode;
import com.softeer.reacton.global.exception.code.OAuthErrorCode;
import com.softeer.reacton.global.jwt.JwtTokenUtil;
import com.softeer.reacton.global.oauth.dto.*;
import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class OAuthService {

    private final OAuthConfig oauthConfig;
    private final JwtTokenUtil jwtTokenUtil;
    private final ProfessorRepository professorRepository;
    private final WebClient webClient;

    public String getOauthLoginUrl(String providerName) {
        OAuthProvider provider = oauthConfig.getProvider(providerName);
        StringBuilder urlBuilder = new StringBuilder(provider.getLoginUrl());

        urlBuilder.append("?scope=").append(URLEncoder.encode(provider.getScope(), StandardCharsets.UTF_8))
                .append("&client_id=").append(provider.getClientId())
                .append("&redirect_uri=").append(URLEncoder.encode(provider.getRedirectUri(), StandardCharsets.UTF_8))
                .append("&response_type=code");

        return urlBuilder.toString();
    }

    public OAuthLoginResult processOauthLogin(String providerName, String code) {
        if( code== null || code.isEmpty() ) {
            throw new BaseException(GlobalErrorCode.MISSING_PARAMETER);
        }

        OAuthProvider provider = oauthConfig.getProvider(providerName);

        OAuthTokenResponse tokenResponse = getAuthAccessTokenByOauth(code, provider);
        UserProfile userProfile = getUserProfile(providerName, provider, tokenResponse);

        Optional<Professor> existingUser = professorRepository.findByOauthId(userProfile.getOauthId());

        existingUser.ifPresent(professor -> {
            if (!professor.getEmail().equals(userProfile.getEmail())) {
                professor.updateEmail(userProfile.getEmail());
                professorRepository.save(professor);
            }
        });

        boolean isSignedUp = existingUser.isPresent();
        String accessToken = isSignedUp
                ? jwtTokenUtil.createAuthAccessToken(userProfile.getOauthId(), userProfile.getEmail())
                : jwtTokenUtil.createSignUpToken(userProfile.getOauthId(), userProfile.getEmail());

        return new OAuthLoginResult(accessToken, isSignedUp);
    }

    private OAuthTokenResponse getAuthAccessTokenByOauth(String code, OAuthProvider provider) {
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
            throw new BaseException(GlobalErrorCode.SERVER_ERROR);
        }
    }

    private UserProfile getUserProfile(String providerName, OAuthProvider provider, OAuthTokenResponse tokenResponse) {
        if ("google".equals(providerName)) {
            return webClient.get()
                    .uri(provider.getUserInfoUri())
                    .headers(header -> header.setBearerAuth(tokenResponse.getAccessToken()))
                    .retrieve()
                    .bodyToMono(GoogleUserProfile.class)
                    .block();
        }

        throw new BaseException(OAuthErrorCode.UNSUPPORTED_OAUTH_PROVIDER);
    }
}
