package com.softeer.reacton.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum SseErrorCode implements ErrorCode {
    MESSAGE_SEND_FAILURE(HttpStatus.INTERNAL_SERVER_ERROR, "메시지 전송에 실패했습니다.");

    private final HttpStatus status;
    private final String message;

    @Override
    public String getCode() {
        return name();
    }
}