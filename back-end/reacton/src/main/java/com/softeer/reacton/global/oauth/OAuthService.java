package com.softeer.reacton.global.oauth;

import com.softeer.reacton.domain.professor.Professor;
import com.softeer.reacton.domain.professor.ProfessorRepository;
import com.softeer.reacton.global.jwt.JwtTokenUtil;
import com.softeer.reacton.global.oauth.dto.GoogleUserProfile;
import com.softeer.reacton.global.oauth.dto.LoginResponse;
import com.softeer.reacton.global.oauth.dto.OAuthTokenResponse;
import com.softeer.reacton.global.oauth.dto.UserProfile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class OAuthService {

    private final OAuthConfig oauthConfig;
    private final JwtTokenUtil jwtTokenUtil;
    private final ProfessorRepository professorRepository;
    private final WebClient webClient;

    public OAuthService(OAuthConfig oauthConfig, JwtTokenUtil jwtTokenUtil,
                        ProfessorRepository professorRepository, WebClient webClient) {
        this.oauthConfig = oauthConfig;
        this.jwtTokenUtil = jwtTokenUtil;
        this.professorRepository = professorRepository;
        this.webClient = webClient;
    }


    public String getOauthLoginUrl(String providerName) {
        OAuthProvider provider = oauthConfig.getProvider(providerName);
        StringBuilder urlBuilder = new StringBuilder(provider.getLoginUrl());

        urlBuilder.append("?scope=").append(URLEncoder.encode(provider.getScope(), StandardCharsets.UTF_8))
                .append("&client_id=").append(provider.getClientId())
                .append("&redirect_uri=").append(URLEncoder.encode(provider.getRedirectUri(), StandardCharsets.UTF_8))
                .append("&response_type=code");

        return urlBuilder.toString();
    }


    public LoginResponse processOauthLogin(String providerName, String code) {
        OAuthProvider provider = oauthConfig.getProvider(providerName);

        OAuthTokenResponse tokenResponse = getAccessTokenByOauth(code, provider);
        UserProfile userProfile = getUserProfile(providerName, provider, tokenResponse);

        Professor professor = saveOrUpdate(userProfile);

        String accessToken = jwtTokenUtil.createAccessToken(userProfile.getEmail());

        return LoginResponse.builder()
                .id(professor.getId())
                .name(professor.getName())
                .email(professor.getEmail())
                .imageUrl(professor.getProfileImgUrl())
                .tokenType("Bearer")
                .accessToken(accessToken)
                .build();
    }

    private OAuthTokenResponse getAccessTokenByOauth(String code, OAuthProvider provider) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        System.out.println(code);
        formData.add("code", code);
        formData.add("client_id", provider.getClientId());
        formData.add("client_secret", provider.getClientSecret());
        formData.add("redirect_uri", provider.getRedirectUri());
        formData.add("grant_type", "authorization_code");

        return webClient.post()
                .uri(provider.getTokenUri())
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .bodyValue(formData)
                .retrieve()
                .bodyToMono(OAuthTokenResponse.class)
                .block();
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

        throw new IllegalArgumentException("지원하지 않는 OAuth 제공자: " + provider);
    }

    private Professor saveOrUpdate(UserProfile userProfile) {
        Professor professor = professorRepository.findByOauthId(userProfile.getOauthId())
                .map(entity -> {
                    // 이메일이 변경된 경우에만 업데이트
                    if (!entity.getEmail().equals(userProfile.getEmail())) {
                        entity.updateEmail(userProfile.getEmail());
                    }
                    return entity;
                })
                .orElse(userProfile.toProfessor());

        return professorRepository.save(professor);
    }
}
