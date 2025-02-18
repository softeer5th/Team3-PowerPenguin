package com.softeer.reacton.domain.classroom;

import com.softeer.reacton.domain.classroom.dto.ClassroomQuestionResponse;
import com.softeer.reacton.global.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Student Classroom API", description = "학생 강의실 관련 API")
public class StudentClassroomController {

    private final StudentClassroomService studentClassroomService;

    @GetMapping("/{accessCode}/summary")
    @Operation(
            summary = "학생 질문 목록 조회",
            description = "학생이 이전에 질문했던 목록을 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "성공적으로 조회했습니다."),
                    @ApiResponse(responseCode = "404", description = "수업을 찾을 수 없습니다."),
                    @ApiResponse(responseCode = "409", description = "아직 수업이 시작되지 않았습니다."),
                    @ApiResponse(responseCode = "500", description = "서버와의 연결에 실패했습니다.")
            }
    )
    public ResponseEntity<SuccessResponse<ClassroomQuestionResponse>> getQuestions(HttpServletRequest request) {
        log.debug("학생 사용자가 이전에 질문했던 목록을 요청합니다.");

        String studentId = (String) request.getAttribute("studentId");
        Long courseId = (Long) request.getAttribute("courseId");

        ClassroomQuestionResponse response = studentClassroomService.getQuestionsByStudentId(studentId, courseId);

        log.info("질문 목록을 성공적으로 조회했습니다.");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SuccessResponse.of("성공적으로 조회했습니다.", response));
    }
}
