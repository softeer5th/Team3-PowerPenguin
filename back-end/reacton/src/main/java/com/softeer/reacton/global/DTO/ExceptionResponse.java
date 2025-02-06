package com.softeer.reacton.global.DTO;

import com.softeer.reacton.global.exception.code.ErrorCode;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ExceptionResponse {
    private final boolean success;
    private final String errorCode;
    private final String message;

    @Builder
    public ExceptionResponse(String message, String errorCode) {
        this.success = false;
        this.errorCode = errorCode;
        this.message = message;
    }

    public static ExceptionResponse of(ErrorCode errorCode) {
        return ExceptionResponse.builder()
                .errorCode(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
    }
}
