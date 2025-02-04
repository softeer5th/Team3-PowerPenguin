package com.softeer.reacton.global.exception;

import com.softeer.reacton.global.exception.code.ErrorCode;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ExceptionResponse {
    private final boolean success;
    private final String message;
    private final String errorCode;

    @Builder
    public ExceptionResponse(String message, String errorCode) {
        this.success = false;
        this.message = message;
        this.errorCode = errorCode;
    }

    public static ExceptionResponse of(ErrorCode errorCode) {
        return ExceptionResponse.builder()
                .message(errorCode.getMessage())
                .errorCode(errorCode.getCode())
                .build();
    }
}
