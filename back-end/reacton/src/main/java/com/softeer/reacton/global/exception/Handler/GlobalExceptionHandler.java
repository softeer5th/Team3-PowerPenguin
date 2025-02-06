package com.softeer.reacton.global.exception.Handler;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.DTO.ExceptionResponse;
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
    public ResponseEntity<ExceptionResponse> handleBaseException(BaseException e) {
        log.warn(e.getErrorCode().getMessage());
        return ResponseEntity
                .status(e.getErrorCode().getStatus())
                .body(ExceptionResponse.of(e.getErrorCode()));
    }

    @ExceptionHandler(MethodNotAllowedException.class)
    public ResponseEntity<ExceptionResponse> handleMethodNotAllowedException(MethodNotAllowedException e) {
        log.warn(GlobalErrorCode.METHOD_NOT_ALLOWED.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.METHOD_NOT_ALLOWED.getStatus())
                .body(ExceptionResponse.of(GlobalErrorCode.METHOD_NOT_ALLOWED));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ExceptionResponse> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.warn(GlobalErrorCode.METHOD_NOT_ALLOWED.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.METHOD_NOT_ALLOWED.getStatus())
                .body(ExceptionResponse.of(GlobalErrorCode.METHOD_NOT_ALLOWED));
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ExceptionResponse> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException e) {
        log.warn(GlobalErrorCode.UNSUPPORTED_MEDIA_TYPE.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.UNSUPPORTED_MEDIA_TYPE.getStatus())
                .body(ExceptionResponse.of(GlobalErrorCode.UNSUPPORTED_MEDIA_TYPE));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidationException(MethodArgumentNotValidException e) {
        log.warn(GlobalErrorCode.VALIDATION_FAIL.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.VALIDATION_FAIL.getStatus())
                .body(ExceptionResponse.of(GlobalErrorCode.VALIDATION_FAIL));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ExceptionResponse> handleMissingParamException(MissingServletRequestParameterException e) {
        log.warn(GlobalErrorCode.MISSING_PARAMETER.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.MISSING_PARAMETER.getStatus())
                .body(ExceptionResponse.of(GlobalErrorCode.MISSING_PARAMETER));
    }

    @ExceptionHandler(TypeMismatchException.class)
    public ResponseEntity<ExceptionResponse> handleTypeMismatchException(TypeMismatchException e) {
        log.warn(GlobalErrorCode.WRONG_TYPE.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.WRONG_TYPE.getStatus())
                .body(ExceptionResponse.of(GlobalErrorCode.WRONG_TYPE));
    }
}
