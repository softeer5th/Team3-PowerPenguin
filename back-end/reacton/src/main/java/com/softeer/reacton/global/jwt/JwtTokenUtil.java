package com.softeer.reacton.global.jwt;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.JwtErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

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
        return Jwts.builder()
                .claim("oauthId", oauthId)
                .claim("email", email)
                .claim("isSignedUp", true)
                .setExpiration(new Date(System.currentTimeMillis() + authTokenExpiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createSignUpToken(String oauthId, String email) {
        return Jwts.builder()
                .claim("oauthId", oauthId)
                .claim("email", email)
                .claim("isSignedUp", false)
                .setExpiration(new Date(System.currentTimeMillis() + signUpTokenExpiration))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public void validateToken(String token) {
        if (token == null || token.isBlank()) {
            throw new BaseException(JwtErrorCode.EMPTY_JWT);
        }

        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
        } catch (ExpiredJwtException e) {
            throw new BaseException(JwtErrorCode.EXPIRED_JWT);
        } catch (SecurityException e) {
            throw new BaseException(JwtErrorCode.INVALID_SIGNATURE);
        } catch (MalformedJwtException e) {
            throw new BaseException(JwtErrorCode.MALFORMED_SIGNATURE);
        } catch (UnsupportedJwtException e) {
            throw new BaseException(JwtErrorCode.TOKEN_PARSING_FAILED);
        } catch (IllegalArgumentException e) {
            throw new BaseException(JwtErrorCode.EMPTY_JWT);
        } catch (JwtException e){
            throw new BaseException(JwtErrorCode.INVALID_JWT);
        }
    }

    public Map<String, Object> getUserInfoFromToken(String token) {
        Claims claims;
        try {
            claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            throw new BaseException(JwtErrorCode.INVALID_JWT);
        }

        String oauthId = claims.get("oauthId", String.class);
        String email = claims.get("email", String.class);
        Boolean isSignedUp = claims.get("isSignedUp", Boolean.class);

        if (oauthId == null || email == null || isSignedUp == null) {
            throw new BaseException(JwtErrorCode.MISSING_CLAIM);
        }

        return Map.of(
                "oauthId", oauthId,
                "email", email,
                "isSignedUp", isSignedUp
        );
    }
}