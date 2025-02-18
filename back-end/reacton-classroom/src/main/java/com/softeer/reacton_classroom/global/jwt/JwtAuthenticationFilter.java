package com.softeer.reacton_classroom.global.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.softeer.reacton_classroom.global.exception.BaseException;
import com.softeer.reacton_classroom.global.dto.ExceptionResponse;
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

    private final JwtTokenUtil jwtTokenUtil;

    private static final String TOKEN_COOKIE_NAME = "access_token";
    private static final String STUDENT_ACCESS_URL = "/sse/connection/student";
    private static final List<String> WHITE_LIST_URLS = List.of(
            "/sse/message"
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

            if ((isStudentRequest(requestUri))) {
                filterStudent(request, token);
            }

            chain.doFilter(request, response);
        } catch (BaseException e) {
            setErrorResponse(response, e);
        }
    }

    private void filterStudent(HttpServletRequest request, String token) {
        Map<String, Object> userInfo = jwtTokenUtil.getStudentInfoFromToken(token);

        request.setAttribute("studentId", userInfo.get("studentId"));
        request.setAttribute("courseId", userInfo.get("courseId"));

        log.debug("JWT 검증에 성공했습니다. : studentId = {}", userInfo.get("studentId"));
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

    private boolean isStudentRequest(String requestUri) {
        return requestUri.startsWith(STUDENT_ACCESS_URL);
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
