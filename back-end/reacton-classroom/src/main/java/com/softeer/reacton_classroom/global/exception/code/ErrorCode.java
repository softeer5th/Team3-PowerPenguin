package com.softeer.reacton_classroom.global.exception.code;

import org.springframework.http.HttpStatus;

public interface ErrorCode {
    String getCode();
    HttpStatus getStatus();
    String getMessage();
}
