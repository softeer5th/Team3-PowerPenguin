package com.softeer.reacton_classroom.global.exception.handler;

import com.softeer.reacton_classroom.global.dto.ExceptionResponse;
import com.softeer.reacton_classroom.global.exception.BaseException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ExceptionResponse> handleBaseException(BaseException e) {
        log.warn(e.getErrorCode().getMessage());
        return ResponseEntity
                .status(e.getErrorCode().getStatus())
                .body(ExceptionResponse.of(e.getErrorCode()));
    }
}
