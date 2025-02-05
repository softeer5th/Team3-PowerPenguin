package com.softeer.reacton.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ProfessorErrorCode implements ErrorCode {
    ALREADY_REGISTERED_USER(HttpStatus.CONFLICT, "이미 가입된 사용자입니다."),
    IMAGE_PROCESSING_FAILURE(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 변환 중 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String message;

    @Override
    public String getCode() {
        return name();
    }
}
