package com.softeer.reacton.global.exception.Handler;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.DTO.FailResponse;
import com.softeer.reacton.global.exception.code.GlobalErrorCode;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.MethodNotAllowedException;

@Log4j2
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<FailResponse> handleBaseException(BaseException e) {
        log.warn(e.getErrorCode().getMessage());
        return ResponseEntity
                .status(e.getErrorCode().getStatus())
                .body(FailResponse.of(e.getErrorCode()));
    }

    @ExceptionHandler(MethodNotAllowedException.class)
    public ResponseEntity<FailResponse> handleMethodNotAllowedException(MethodNotAllowedException e) {
        log.warn(GlobalErrorCode.METHOD_NOT_ALLOWED.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.METHOD_NOT_ALLOWED.getStatus())
                .body(FailResponse.of(GlobalErrorCode.METHOD_NOT_ALLOWED));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<FailResponse> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.warn(GlobalErrorCode.METHOD_NOT_ALLOWED.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.METHOD_NOT_ALLOWED.getStatus())
                .body(FailResponse.of(GlobalErrorCode.METHOD_NOT_ALLOWED));
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<FailResponse> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException e) {
        log.warn(GlobalErrorCode.UNSUPPORTED_MEDIA_TYPE.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.UNSUPPORTED_MEDIA_TYPE.getStatus())
                .body(FailResponse.of(GlobalErrorCode.UNSUPPORTED_MEDIA_TYPE));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<FailResponse> handleValidationException(MethodArgumentNotValidException e) {
        log.warn(GlobalErrorCode.VALIDATION_FAIL.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.VALIDATION_FAIL.getStatus())
                .body(FailResponse.of(GlobalErrorCode.VALIDATION_FAIL));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<FailResponse> handleMissingParamException(MissingServletRequestParameterException e) {
        log.warn(GlobalErrorCode.MISSING_PARAMETER.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.MISSING_PARAMETER.getStatus())
                .body(FailResponse.of(GlobalErrorCode.MISSING_PARAMETER));
    }

    @ExceptionHandler(TypeMismatchException.class)
    public ResponseEntity<FailResponse> handleTypeMismatchException(TypeMismatchException e) {
        log.warn(GlobalErrorCode.WRONG_TYPE.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.WRONG_TYPE.getStatus())
                .body(FailResponse.of(GlobalErrorCode.WRONG_TYPE));
    }
}
