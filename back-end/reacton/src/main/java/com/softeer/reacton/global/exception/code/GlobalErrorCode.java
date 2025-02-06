package com.softeer.reacton.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GlobalErrorCode implements ErrorCode {
    INVALID_PATH(HttpStatus.NOT_FOUND, "유효하지 않은 경로입니다."),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버와의 연결에 실패했습니다."),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "인증되지 않은 접근입니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "허용되지 않은 HTTP 메서드입니다."),
    UNSUPPORTED_MEDIA_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "지원하지 않는 미디어 타입입니다."),
    TOO_MANY_REQUESTS(HttpStatus.TOO_MANY_REQUESTS, "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요."),
    VALIDATION_FAILURE(HttpStatus.BAD_REQUEST, "유효성 검사에 실패했습니다."),
    MISSING_PARAMETER(HttpStatus.BAD_REQUEST, "필수 파라미터가 누락되었습니다."),
    WRONG_TYPE(HttpStatus.BAD_REQUEST, "요청 타입이 잘못됐습니다.");

    private final HttpStatus status;
    private final String message;

    @Override
    public String getCode() {
        return name();
    }
}
