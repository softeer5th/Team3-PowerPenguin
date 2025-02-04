package com.softeer.reacton.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ProfessorErrorCode implements ErrorCode {
    ALREADY_REGISTERED_USER("이미 가입된 사용자입니다.", HttpStatus.CONFLICT),
    IMAGE_PROCESSING_FAILURE("이미지 변환 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String message;
    private final HttpStatus status;

    @Override
    public String getCode() {
        return name();
    }
}
