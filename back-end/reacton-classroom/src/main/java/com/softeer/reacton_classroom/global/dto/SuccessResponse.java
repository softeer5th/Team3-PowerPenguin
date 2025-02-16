package com.softeer.reacton_classroom.global.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

@Getter
@JsonPropertyOrder({"success", "message"})
public class SuccessResponse {
    private final boolean success;
    private final String message;

    @Builder
    public SuccessResponse(String message) {
        this.success = true;
        this.message = message;
    }

    public static SuccessResponse of(String message) {
        return SuccessResponse.builder()
                .message(message)
                .build();
    }
}
