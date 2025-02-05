package com.softeer.reacton.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum JwtErrorCode implements ErrorCode {
    ACCESS_TOKEN_ERROR("인증되지 않은 접근입니다.", HttpStatus.UNAUTHORIZED);

    private final String message;
    private final HttpStatus status;

    @Override
    public String getCode() {
        return name();
    }
}
