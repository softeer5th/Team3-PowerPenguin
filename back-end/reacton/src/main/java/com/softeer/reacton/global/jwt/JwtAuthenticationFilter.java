package com.softeer.reacton.global.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.dto.ExceptionResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    // Todo: JWT 토큰 검증을 하지 않아도 되는 페이지에 대해 filter 미적용 기능 추가

    private final JwtTokenUtil jwtTokenUtil;

    private static final String TOKEN_COOKIE_NAME = "access_token";

    private static final List<String> WHITE_LIST_URLS = List.of(
            "/auth/google/url",
            "/auth/google/callback"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        log.debug("JWT 토큰 관련 필터 작업을 수행합니다.");

        String requestUri = request.getRequestURI();
        if (isWhiteListed(requestUri)) {
            log.debug("필터를 적용하지 않는 URL 주소입니다. : requestUri = {}", requestUri);
            chain.doFilter(request, response);
            return;
        }

        try {
            String token = getJwtFromCookie(request);
            jwtTokenUtil.validateToken(token);
            Map<String, Object> userInfo = jwtTokenUtil.getUserInfoFromToken(token);

            request.setAttribute("oauthId", userInfo.get("oauthId"));
            request.setAttribute("email", userInfo.get("email"));
            request.setAttribute("isSignedUp", userInfo.get("isSignedUp"));

            log.debug("JWT 검증에 성공했습니다. : email = {}", userInfo.get("email"));

            chain.doFilter(request, response);
        } catch (BaseException e) {
            setErrorResponse(response, e);
        }
    }

    private boolean isWhiteListed(String requestUri) {
        return WHITE_LIST_URLS.stream().anyMatch(requestUri::startsWith);
    }

    private String getJwtFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            log.debug("쿠키가 존재하지 않습니다.");
            return null;
        }

        return Arrays.stream(request.getCookies())
                .filter(cookie -> TOKEN_COOKIE_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private void setErrorResponse(HttpServletResponse response, BaseException e) throws IOException {
        log.warn(e.getErrorCode().getMessage());

        ObjectMapper objectMapper = new ObjectMapper();

        response.setContentType("application/json");
        response.setStatus(e.getErrorCode().getStatus().value());

        ExceptionResponse exceptionResponse = ExceptionResponse.of(e.getErrorCode());

        objectMapper.writeValue(response.getOutputStream(), exceptionResponse);
    }
}