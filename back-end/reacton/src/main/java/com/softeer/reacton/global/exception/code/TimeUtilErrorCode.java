package com.softeer.reacton.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum TimeUtilErrorCode implements ErrorCode {
    NULL_TIME_STRING(HttpStatus.BAD_REQUEST, "시간 문자열은 null일 수 없습니다."),
    INVALID_TIME_FORMAT(HttpStatus.BAD_REQUEST, "잘못된 시간 형식입니다. 올바른 형식: HH:mm"),
    NULL_LOCAL_TIME(HttpStatus.BAD_REQUEST, "LocalTime 객체는 null일 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    @Override
    public String getCode() {
        return name();
    }
}