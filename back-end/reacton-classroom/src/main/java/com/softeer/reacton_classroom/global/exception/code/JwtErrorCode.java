package com.softeer.reacton_classroom.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum JwtErrorCode implements ErrorCode {
    ACCESS_TOKEN_ERROR(HttpStatus.UNAUTHORIZED, "인증되지 않은 접근입니다.");

    private final HttpStatus status;
    private final String message;

    @Override
    public String getCode() {
        return name();
    }
}
