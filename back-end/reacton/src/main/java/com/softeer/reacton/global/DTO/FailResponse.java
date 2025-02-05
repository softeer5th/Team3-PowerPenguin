package com.softeer.reacton.global.DTO;

import com.softeer.reacton.global.exception.code.ErrorCode;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

@Getter
public class FailResponse {
    @Schema(description = "성공 여부", example = "false")
    private final boolean success;

    @Schema(description = "에러코드", example = "NOT_FOUND")
    private final String errorCode;

    @Schema(description = "메시지", example = "유효하지 않은 경로입니다.")
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
