package com.softeer.reacton.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum JwtErrorCode implements ErrorCode {
    // Todo : isSignUp = true이나, 데이터베이스에 존재하지 않는 사용자에 대한 예외 처리 구현
    EMPTY_JWT("JWT 토큰이 존재하지 않습니다.", HttpStatus.UNAUTHORIZED),
    INVALID_JWT("유효하지 않은 JWT 토큰입니다.", HttpStatus.UNAUTHORIZED),
    EXPIRED_JWT("만료된 JWT 토큰입니다.", HttpStatus.UNAUTHORIZED),
    INVALID_SIGNATURE("JWT 토큰 서명이 올바르지 않습니다.", HttpStatus.UNAUTHORIZED),
    MALFORMED_SIGNATURE("JWT 토큰 형식이 올바르지 않습니다.", HttpStatus.UNAUTHORIZED),
    TOKEN_PARSING_FAILED("JWT 토큰을 파싱하는 중 오류가 발생했습니다.", HttpStatus.UNAUTHORIZED),
    MISSING_CLAIM("JWT 토큰의 필수 정보가 누락되었습니다.", HttpStatus.UNAUTHORIZED);

    private final String message;
    private final HttpStatus status;

    @Override
    public String getCode() {
        return name();
    }
}
