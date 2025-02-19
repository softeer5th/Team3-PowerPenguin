package com.softeer.reacton.global.exception.Handler;

import com.softeer.reacton.global.dto.ExceptionResponse;
import com.softeer.reacton.global.exception.code.S3ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.S3Exception;

@Slf4j
@RestControllerAdvice
public class S3ExceptionHandler {

    @ExceptionHandler(NoSuchBucketException.class)
    public ResponseEntity<ExceptionResponse> handleNoSuchBucketException(NoSuchBucketException e) {
        log.warn(S3ErrorCode.S3_BUCKET_NOT_FOUND.getMessage());
        return ResponseEntity
                .status(S3ErrorCode.S3_BUCKET_NOT_FOUND.getStatus())
                .body(ExceptionResponse.of(S3ErrorCode.S3_BUCKET_NOT_FOUND));
    }

    @ExceptionHandler(NoSuchKeyException.class)
    public ResponseEntity<ExceptionResponse> handleNoSuchKeyException(NoSuchKeyException e) {
        log.warn(S3ErrorCode.S3_OBJECT_NOT_FOUND.getMessage());
        return ResponseEntity
                .status(S3ErrorCode.S3_OBJECT_NOT_FOUND.getStatus())
                .body(ExceptionResponse.of(S3ErrorCode.S3_OBJECT_NOT_FOUND));
    }

    @ExceptionHandler(S3Exception.class)
    public ResponseEntity<ExceptionResponse> handleS3Exception(S3Exception e) {
        return switch (e.statusCode()) {
            case 400 -> {
                log.warn(S3ErrorCode.S3_BAD_REQUEST.getMessage());
                yield ResponseEntity
                        .status(S3ErrorCode.S3_BAD_REQUEST.getStatus())
                        .body(ExceptionResponse.of(S3ErrorCode.S3_BAD_REQUEST));
            }
            case 403 -> {
                log.warn(S3ErrorCode.S3_ACCESS_DENIED.getMessage());
                yield ResponseEntity
                        .status(S3ErrorCode.S3_ACCESS_DENIED.getStatus())
                        .body(ExceptionResponse.of(S3ErrorCode.S3_ACCESS_DENIED));
            }
            default -> {
                log.warn(S3ErrorCode.S3_INTERNAL_ERROR.getMessage());
                yield ResponseEntity
                        .status(S3ErrorCode.S3_INTERNAL_ERROR.getStatus())
                        .body(ExceptionResponse.of(S3ErrorCode.S3_INTERNAL_ERROR));
            }
        };
    }
}
