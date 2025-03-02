package com.softeer.reacton.global.exception.Controller;

import com.softeer.reacton.global.exception.code.GlobalErrorCode;
import com.softeer.reacton.global.dto.ExceptionResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@Slf4j
@RestController
@Tag(name = "CustomError API", description = "에러 처리 관련 API")
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    @Operation(
            summary = "에러 처리",
            description = "DispatcherServlet에 의해 넘겨진 에러에 대한 처리를 수행합니다.",
            responses = {
                    @ApiResponse(responseCode = "404", description = "유효하지 않은 경로입니다."),
                    @ApiResponse(responseCode = "500", description = "서버와의 연결에 실패했습니다.")
            }
    )
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