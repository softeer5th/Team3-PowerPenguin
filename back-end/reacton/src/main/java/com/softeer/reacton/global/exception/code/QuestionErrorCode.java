package com.softeer.reacton.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum QuestionErrorCode implements ErrorCode {
    QUESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 질문 정보를 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    @Override
    public String getCode() {
        return name();
    }
}
