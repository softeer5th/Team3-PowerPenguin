package com.softeer.reacton.global.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Duration;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenUtil {

    private final Key secretKey;
    private final long accessTokenValidity;

    public JwtTokenUtil(
            @Value("${jwt.secret-key}") String secretKey,
            @Value("${jwt.access-token.expire-length}") long accessTokenValidity) {

        String encodedKey = Base64.getEncoder().encodeToString(secretKey.getBytes(StandardCharsets.UTF_8));
        this.secretKey = Keys.hmacShaKeyFor(encodedKey.getBytes());
        this.accessTokenValidity = accessTokenValidity;
    }

    public String createAccessToken(String oauthId, String email, Boolean isSignedUp) {
        return Jwts.builder()
                .claim("sub", oauthId)
                .claim("email", email)
                .claim("isSignedUp", isSignedUp)
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenValidity)) // 24시간
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUserOauthId(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}