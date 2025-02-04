package com.softeer.reacton.global.exception.code;

import org.springframework.http.HttpStatus;

public interface ErrorCode {
    String getMessage();
    String getCode();
    HttpStatus getStatus();
}
