package com.softeer.reacton.global.oauth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OAuthConfig {

    @Value("${oauth.google.login-url}")
    private String googleLoginUrl;
    @Value("${oauth.google.client-id}")
    private String googleClientId;
    @Value("${oauth.google.client-secret}")
    private String googleClientSecret;
    @Value("${oauth.google.redirect-uri}")
    private String googleRedirectUri;
    @Value("${oauth.google.token-uri}")
    private String googleTokenUri;
    @Value("${oauth.google.user-info-uri}")
    private String googleUserInfoUri;
    @Value("${oauth.google.scope}")
    private String googleScope;
    @Value("${oauth.google.prompt}")
    private String googlePrompt;


    public OAuthProvider getProvider(String provider) {
        if (provider.equalsIgnoreCase("google")) {
            return new OAuthProvider(googleLoginUrl, googleClientId, googleClientSecret, googleRedirectUri, googleTokenUri, googleUserInfoUri, googleScope, googlePrompt);
        }
        throw new IllegalArgumentException("지원되지 않는 OAuth 제공자: " + provider);
    }
}
