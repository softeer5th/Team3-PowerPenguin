package com.softeer.reacton.global.exception.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum S3ErrorCode implements ErrorCode {
    S3_ACCESS_DENIED(HttpStatus.FORBIDDEN, "S3 접근 권한이 없습니다."),
    S3_BUCKET_NOT_FOUND(HttpStatus.NOT_FOUND, "S3 버킷을 찾을 수 없습니다."),
    S3_OBJECT_NOT_FOUND(HttpStatus.NOT_FOUND, "S3에서 요청한 파일을 찾을 수 없습니다."),
    S3_INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "S3 내부 오류가 발생했습니다."),
    S3_BAD_REQUEST(HttpStatus.BAD_REQUEST, "S3 요청이 잘못되었습니다.");

    private final HttpStatus status;
    private final String message;

    @Override
    public String getCode() {
        return name();
    }
}
