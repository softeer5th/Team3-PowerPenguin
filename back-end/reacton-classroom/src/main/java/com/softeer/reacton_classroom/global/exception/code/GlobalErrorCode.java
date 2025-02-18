package com.softeer.reacton_classroom.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GlobalErrorCode implements ErrorCode {
    INVALID_PATH(HttpStatus.NOT_FOUND, "유효하지 않은 경로입니다."),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버와의 연결에 실패했습니다.");

    private final HttpStatus status;
    private final String message;

    @Override
    public String getCode() {
        return name();
    }
}
