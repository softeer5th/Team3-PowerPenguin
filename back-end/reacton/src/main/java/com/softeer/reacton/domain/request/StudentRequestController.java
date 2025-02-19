package com.softeer.reacton.domain.request;

import com.softeer.reacton.domain.request.dto.RequestSendRequest;
import com.softeer.reacton.global.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/students/requests")
@Tag(name = "Student Request API", description = "학생 요청 관련 API")
@RequiredArgsConstructor
public class StudentRequestController {

    private final StudentRequestService studentRequestService;

    @PostMapping
    @Operation(
            summary = "학생 요청 전송",
            description = "학생이 교수에게 요청을 전송합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "성공적으로 전송했습니다."),
                    @ApiResponse(responseCode = "404", description = "수업을 찾을 수 없습니다."),
                    @ApiResponse(responseCode = "409", description = "아직 수업이 시작되지 않았습니다."),
                    @ApiResponse(responseCode = "500", description = "서버와의 연결에 실패했습니다.")
            }
    )
    public ResponseEntity<Void> sendRequest(
            @Valid @RequestBody RequestSendRequest requestSendRequest,
            HttpServletRequest request) {
        log.debug("학생 사용자가 요청 등록 및 전송을 요청합니다.");

        Long courseId = (Long) request.getAttribute("courseId");

        studentRequestService.sendRequest(courseId, requestSendRequest);

        log.info("요청을 성공적으로 등록했습니다.");

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
