package com.softeer.reacton.global.DTO;

import com.softeer.reacton.global.exception.code.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
public class FailResponse {
    private final boolean success;
    private final String errorCode;
    private final String message;

    @Builder
    public FailResponse(String message, String errorCode) {
        this.success = false;
        this.errorCode = errorCode;
        this.message = message;
    }

    public static FailResponse of(ErrorCode errorCode) {
        return FailResponse.builder()
                .errorCode(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();
    }
}
