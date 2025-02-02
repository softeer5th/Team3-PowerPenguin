package com.softeer.reacton.global.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    // JWT 비밀키와 만료 시간 설정
    // 만료 시간을 설정함으로써 탈취 시에도 동일한 키로 접근하지 못하게 막는다.
    private static SecretKey secretKey = null;

    //private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1시간

    // SecretKey를 Bean 초기화 시 생성
    public JwtUtil(@Value("${app.jwt.secret-key}") String secretKey) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    // JWT 생성
    public static String generateJwt(String userId, String email) {

        Map<String, Object> header = new HashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        return Jwts.builder()
                .setHeader(header)
                .setSubject(userId)  // 사용자 고유 식별자
                .claim("email", email)  // 추가 정보
                .setIssuedAt(new Date())  // 토큰 생성 시간
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))  // 만료 시간
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT 검증 및 Claims 추출
    public static Claims validateJwt(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token has expired");
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }
    }
}
