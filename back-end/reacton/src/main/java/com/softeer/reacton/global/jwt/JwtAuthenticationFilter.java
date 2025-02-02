package com.softeer.reacton.global.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;

    private static final String TOKEN_COOKIE_NAME = "access_token";
    private static final String AUTH_ERROR_MESSAGE = "Unauthorized: Invalid or Expired JWT Token";

    private static final List<String> WHITE_LIST_URLS = List.of(
            "/auth/google/url",
            "/auth/google/callback"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String requestUri = request.getRequestURI();
        if (isWhiteListed(requestUri)) {
            chain.doFilter(request, response);
            return;
        }

        String token = getJwtFromCookie(request);
        if (token != null && jwtTokenUtil.validateToken(token)) {
            Map<String, Object> userInfo = jwtTokenUtil.getUserInfoFromToken(token);

            request.setAttribute("oauthId", userInfo.get("oauthId"));
            request.setAttribute("email", userInfo.get("email"));
            request.setAttribute("isSignedUp", userInfo.get("isSignedUp"));
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, AUTH_ERROR_MESSAGE);
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean isWhiteListed(String requestUri) {
        return WHITE_LIST_URLS.stream().anyMatch(requestUri::startsWith);
    }

    private String getJwtFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        return Arrays.stream(request.getCookies())
                .filter(cookie -> TOKEN_COOKIE_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}