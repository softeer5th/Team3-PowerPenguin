package com.softeer.reacton.global.DTO;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class SuccessResponse<T> {

    @Schema(description = "성공 여부", example = "true")
    private boolean success;

    @Schema(description = "메시지", example = "로그인에 성공했습니다.")
    private String message;

    @Schema(description = "응답 데이터")
    private T data;
}