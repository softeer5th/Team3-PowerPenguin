package com.softeer.reacton.global.oauth;

import com.softeer.reacton.domain.professor.Professor;
import com.softeer.reacton.domain.professor.ProfessorRepository;
import com.softeer.reacton.global.jwt.JwtTokenUtil;
import com.softeer.reacton.global.oauth.dto.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

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


    public OAuthLoginResult processOauthLogin(String providerName, String code) {
        OAuthProvider provider = oauthConfig.getProvider(providerName);

        OAuthTokenResponse tokenResponse = getAccessTokenByOauth(code, provider);
        UserProfile userProfile = getUserProfile(providerName, provider, tokenResponse);

        Optional<Professor> existingUser = professorRepository.findByOauthId(userProfile.getOauthId());

        if (existingUser.isPresent() && !existingUser.get().getEmail().equals(userProfile.getEmail())) {
            existingUser.get().updateEmail(userProfile.getEmail());
            professorRepository.save(existingUser.get());
        }

        boolean isSignedUp = existingUser.isPresent();
        String accessToken = jwtTokenUtil.createAccessToken(userProfile.getOauthId(), userProfile.getEmail(), existingUser.isPresent());

        return new OAuthLoginResult(accessToken, isSignedUp);
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
}
