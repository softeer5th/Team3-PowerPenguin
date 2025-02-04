package com.softeer.reacton.global.exception.Handler;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.ExceptionResponse;
import com.softeer.reacton.global.exception.code.GlobalErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.MethodNotAllowedException;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ExceptionResponse> handleBaseException(BaseException e) {
        return ResponseEntity
                .status(e.getErrorCode().getStatus())
                .body(ExceptionResponse.of(e.getErrorCode()));
    }

    @ExceptionHandler(MethodNotAllowedException.class)
    public ResponseEntity<ExceptionResponse> handleMethodNotAllowedException(MethodNotAllowedException e) {
        return ResponseEntity
                .status(GlobalErrorCode.METHOD_NOT_ALLOWED.getStatus())
                .body(ExceptionResponse.of(GlobalErrorCode.METHOD_NOT_ALLOWED));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ExceptionResponse> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        return ResponseEntity
                .status(GlobalErrorCode.METHOD_NOT_ALLOWED.getStatus())
                .body(ExceptionResponse.of(GlobalErrorCode.METHOD_NOT_ALLOWED));
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ExceptionResponse> handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException e) {
        return ResponseEntity
                .status(GlobalErrorCode.UNSUPPORTED_MEDIA_TYPE.getStatus())
                .body(ExceptionResponse.of(GlobalErrorCode.UNSUPPORTED_MEDIA_TYPE));
    }
}
