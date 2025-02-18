package com.softeer.reacton_classroom.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum SseErrorCode implements ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "전송 대상을 찾을 수 없습니다."),
    MESSAGE_SEND_FAILURE(HttpStatus.INTERNAL_SERVER_ERROR, "서버 문제로 메시지 전송에 실패했습니다.");

    private final HttpStatus status;
    private final String message;

    @Override
    public String getCode() {
        return name();
    }
}
