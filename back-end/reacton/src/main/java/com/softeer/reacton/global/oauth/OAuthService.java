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

    public OAuthService(OAuthConfig oauthConfig) {
        this.oauthConfig = oauthConfig;
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
}