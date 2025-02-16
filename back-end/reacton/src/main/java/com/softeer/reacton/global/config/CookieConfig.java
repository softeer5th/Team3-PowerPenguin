package com.softeer.reacton.global.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class CookieConfig {
    private final int authExpiration;
    private final int signupExpiration;
    private final String domain;

    public CookieConfig(@Value("${cookie.auth.expiration}") int authExpiration,
                        @Value("${cookie.signup.expiration}") int signupExpiration,
                        @Value("${cookie.domain}") String domain ) {
        this.authExpiration = authExpiration;
        this.signupExpiration = signupExpiration;
        this.domain = domain;
    }
}
