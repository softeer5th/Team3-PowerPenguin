package com.softeer.reacton.global.exception.Controller;

import com.softeer.reacton.global.exception.code.GlobalErrorCode;
import com.softeer.reacton.global.exception.ExceptionResponse;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@Log4j2
@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<ExceptionResponse> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        Integer statusCode = Optional.ofNullable(status)
                .filter(s -> s instanceof Integer || s instanceof String)
                .map(s -> s instanceof Integer ? (Integer) s : Integer.parseInt(s.toString()))
                .orElse(null);

        if (statusCode != null && statusCode == HttpStatus.NOT_FOUND.value()) {
            log.warn(GlobalErrorCode.INVALID_PATH.getMessage());
            return ResponseEntity
                    .status(GlobalErrorCode.INVALID_PATH.getStatus())
                    .body(ExceptionResponse.of(GlobalErrorCode.INVALID_PATH));
        }

        log.error(GlobalErrorCode.SERVER_ERROR.getMessage());
        return ResponseEntity
                .status(GlobalErrorCode.SERVER_ERROR.getStatus())
                .body(ExceptionResponse.of(GlobalErrorCode.SERVER_ERROR));
    }
}