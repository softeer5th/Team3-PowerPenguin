package com.softeer.reacton_classroom.global.jwt;

import com.softeer.reacton_classroom.global.exception.BaseException;
import com.softeer.reacton_classroom.global.exception.code.JwtErrorCode;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Map;

@Slf4j
@Component
public class JwtTokenUtil {

    private final Key secretKey;

    public JwtTokenUtil(
            @Value("${jwt.secret-key}") String secretKey) {

        String encodedKey = Base64.getEncoder().encodeToString(secretKey.getBytes(StandardCharsets.UTF_8));
        this.secretKey = Keys.hmacShaKeyFor(encodedKey.getBytes());
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

    public Map<String, Object> getStudentInfoFromToken(String token) {
        log.debug("토큰으로부터 학생 정보를 가져옵니다.");

        Claims claims = getClaims(token);

        String studentId = claims.get("studentId", String.class);
        Long courseId = claims.get("courseId", Long.class);

        if (studentId == null || courseId == null) {
            log.debug("JWT 토큰으로부터 학생 정보를 가져오는 과정에서 발생한 에러입니다. : Missing required claims in JWT token.");
            throw new BaseException(JwtErrorCode.ACCESS_TOKEN_ERROR);
        }

        log.debug("학생 정보를 가져오는 데 성공했습니다. : studentId = {}, courseId = {}", studentId, courseId);

        return Map.of(
                "studentId", studentId,
                "courseId", courseId
        );
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            log.debug("JWT 토큰으로부터 사용자 정보를 가져오는 과정에서 발생한 에러입니다. : {}", e.getMessage());
            throw new BaseException(JwtErrorCode.ACCESS_TOKEN_ERROR);
        }
    }
}
