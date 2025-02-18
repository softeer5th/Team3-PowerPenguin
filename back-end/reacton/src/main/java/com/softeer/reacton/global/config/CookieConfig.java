package com.softeer.reacton.global.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class CookieConfig {
    private final int authExpiration;
    private final int signupExpiration;
    private final int studentAccessExpiration;
    private final String domain;

    public CookieConfig(@Value("${cookie.auth.expiration}") int authExpiration,
                        @Value("${cookie.signup.expiration}") int signupExpiration,
                        @Value("${cookie.student-access.expiration}") int studentAccessExpiration,
                        @Value("${cookie.domain}") String domain) {
        this.authExpiration = authExpiration;
        this.signupExpiration = signupExpiration;
        this.studentAccessExpiration = studentAccessExpiration;
        this.domain = domain;
    }
}
