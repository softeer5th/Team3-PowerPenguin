package com.softeer.reacton.global.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 쿠키에서 JWT 추출
        String token = null;
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("JWT".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
            }
        }

        // 토큰이 없으면 인증 실패
        if (token == null) {
            response.sendRedirect("/auth/oauth/login");
            return;
        }

        try {
            // JWT 검증 및 Claims 추출
            Claims claims = JwtUtil.validateJwt(token);

            // 사용자의 정보를 SecurityContext에 저장 (생략 가능)
            String userId = claims.getSubject();
            String email = claims.get("email", String.class);
            request.setAttribute("userId", userId);
            request.setAttribute("email", email);

        } catch (RuntimeException e) {
            // 검증 실패
            response.sendRedirect("/auth/oauth/login");
            return;
        }

        filterChain.doFilter(request, response);
    }

    // 필터를 적용하지 않는 경로는 이 곳에 추가한다.
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // 로그인 관련 경로는 필터 미적용
        String path = request.getRequestURI();
        return path.startsWith("/auth/oauth/login") || path.startsWith("/auth/oauth/callback");
    }
}
