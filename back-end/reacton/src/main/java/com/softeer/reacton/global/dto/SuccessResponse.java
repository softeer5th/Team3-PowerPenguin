package com.softeer.reacton.global.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
public class SuccessResponse<T> {
    private final boolean success;
    private final String message;
    private final T data;

    @Builder
    public SuccessResponse(String message, T data) {
        this.success = true;
        this.message = message;
        this.data = data;
    }

    public static SuccessResponse<Map<String, String>> of(String message, Map<String, String> data) {
        return SuccessResponse.<Map<String, String>>builder()
                .message(message)
                .data(data)
                .build();
    }
}