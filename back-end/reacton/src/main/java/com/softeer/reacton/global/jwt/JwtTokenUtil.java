package com.softeer.reacton.global.jwt;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.JwtErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Log4j2
@Component
public class JwtTokenUtil {

    private final Key secretKey;
    private final long authTokenExpiration;
    private final long signUpTokenExpiration;

    public JwtTokenUtil(
            @Value("${jwt.secret-key}") String secretKey,
            @Value("${jwt.auth-access-token.expiration}") long authTokenExpiration,
            @Value("${jwt.signup-access-token.expiration}") long signUpTokenExpiration) {

        String encodedKey = Base64.getEncoder().encodeToString(secretKey.getBytes(StandardCharsets.UTF_8));
        this.secretKey = Keys.hmacShaKeyFor(encodedKey.getBytes());
        this.authTokenExpiration = authTokenExpiration;
        this.signUpTokenExpiration = signUpTokenExpiration;
    }

    public String createAuthAccessToken(String oauthId, String email) {
        log.debug("로그인 JWT 토큰을 생성합니다. : {}", email);

        return Jwts.builder()
                .claim("oauthId", oauthId)
                .claim("email", email)
                .claim("isSignedUp", true)
                .setExpiration(new Date(System.currentTimeMillis() + authTokenExpiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createSignUpToken(String oauthId, String email) {
        log.debug("회원가입 JWT 토큰을 생성합니다. : {}", email);

        return Jwts.builder()
                .claim("oauthId", oauthId)
                .claim("email", email)
                .claim("isSignedUp", false)
                .setExpiration(new Date(System.currentTimeMillis() + signUpTokenExpiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public void validateToken(String token) {
        log.debug("JWT 토큰의 유효성을 검증합니다.");

        if (token == null || token.isBlank()) {
            log.debug("JWT 토큰 검증 과정에서 발생한 에러입니다. : JWT token is missing or empty.");
            throw new BaseException(JwtErrorCode.ACCESS_TOKEN_ERROR);
        }

        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
        } catch (RuntimeException e) {
            log.debug("JWT 토큰 검증 과정에서 발생한 에러입니다. : {}", e.getMessage());
            throw new BaseException(JwtErrorCode.ACCESS_TOKEN_ERROR);
        }

        log.debug("토큰 유효성 검증이 완료되었습니다.");
    }

    public Map<String, Object> getUserInfoFromToken(String token) {
        log.debug("토큰으로부터 사용자 정보를 가져옵니다.");

        Claims claims;
        try {
            claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            log.debug("JWT 토큰으로부터 사용자 정보를 가져오는 과정에서 발생한 에러입니다. : {}", e.getMessage());
            throw new BaseException(JwtErrorCode.ACCESS_TOKEN_ERROR);
        }

        String oauthId = claims.get("oauthId", String.class);
        String email = claims.get("email", String.class);
        Boolean isSignedUp = claims.get("isSignedUp", Boolean.class);

        if (oauthId == null || email == null || isSignedUp == null) {
            log.debug("JWT 토큰으로부터 사용자 정보를 가져오는 과정에서 발생한 에러입니다. : Missing required claims in JWT token.");
            throw new BaseException(JwtErrorCode.ACCESS_TOKEN_ERROR);
        }

        log.debug("사용자 정보를 가져오는 데 성공했습니다. : oauthId = {}, email = {}, isSignedUp = {}", oauthId, email, isSignedUp);

        return Map.of(
                "oauthId", oauthId,
                "email", email,
                "isSignedUp", isSignedUp
        );
    }
}