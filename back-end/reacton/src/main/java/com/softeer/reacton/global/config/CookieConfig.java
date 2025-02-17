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

    public CookieConfig(@Value("${cookie.auth.expiration}") int authExpiration,
                        @Value("${cookie.signup.expiration}") int signupExpiration,
                        @Value("${cookie.student-access.expiration}") int studentAccessExpiration) {
        this.authExpiration = authExpiration;
        this.signupExpiration = signupExpiration;
        this.studentAccessExpiration = studentAccessExpiration;
    }
}
