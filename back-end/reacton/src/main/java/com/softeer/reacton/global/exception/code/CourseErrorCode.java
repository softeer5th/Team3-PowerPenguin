package com.softeer.reacton.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CourseErrorCode implements ErrorCode {
    COURSE_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 강의 정보를 찾을 수 없습니다."),
    UNAUTHORIZED_PROFESSOR(HttpStatus.FORBIDDEN, "이 강의에 접근할 권한이 없습니다."),
    COURSE_REQUEST_IS_NULL(HttpStatus.BAD_REQUEST, "수업 요청 정보가 입력되지 않았습니다."),
    COURSE_ALREADY_ACTIVE(HttpStatus.BAD_REQUEST, "이미 시작 상태인 수업입니다."),
    COURSE_ALREADY_INACTIVE(HttpStatus.BAD_REQUEST, "이미 종료 상태인 수업입니다.");

    private final HttpStatus status;
    private final String message;

    @Override
    public String getCode() {
        return name();
    }
}