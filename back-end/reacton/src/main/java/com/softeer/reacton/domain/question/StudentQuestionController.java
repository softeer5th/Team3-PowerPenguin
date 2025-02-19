package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.course.dto.CourseQuestionResponse;
import com.softeer.reacton.domain.question.dto.QuestionAllResponse;
import com.softeer.reacton.domain.question.dto.QuestionSendRequest;
import com.softeer.reacton.global.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/students/questions")
@Tag(name = "Student Questions API", description = "학생 질문 관련 API")
@RequiredArgsConstructor
public class StudentQuestionController {

    private final StudentQuestionService studentQuestionService;

    @GetMapping
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
    public ResponseEntity<SuccessResponse<QuestionAllResponse>> getQuestions(HttpServletRequest request) {
        log.debug("학생 사용자가 이전에 질문했던 목록을 요청합니다.");

        String studentId = (String) request.getAttribute("studentId");
        Long courseId = (Long) request.getAttribute("courseId");

        QuestionAllResponse response = studentQuestionService.getQuestionsByStudentId(studentId, courseId);

        log.info("질문 목록을 성공적으로 조회했습니다.");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SuccessResponse.of("성공적으로 조회했습니다.", response));
    }

    @PostMapping
    @Operation(
            summary = "학생 질문 전송",
            description = "학생이 교수에게 질문을 전송합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "성공적으로 전송했습니다."),
                    @ApiResponse(responseCode = "404", description = "수업을 찾을 수 없습니다."),
                    @ApiResponse(responseCode = "409", description = "아직 수업이 시작되지 않았습니다."),
                    @ApiResponse(responseCode = "500", description = "서버와의 연결에 실패했습니다.")
            }
    )
    public ResponseEntity<SuccessResponse<CourseQuestionResponse>> sendQuestion(
            @RequestBody QuestionSendRequest questionSendRequest,
            HttpServletRequest request) {
        log.debug("학생 사용자가 질문 등록 및 전송을 요청합니다.");

        String studentId = (String) request.getAttribute("studentId");
        Long courseId = (Long) request.getAttribute("courseId");
        String content = questionSendRequest.getContent();

        CourseQuestionResponse response = studentQuestionService.sendQuestion(studentId, courseId, content);

        log.info("질문을 성공적으로 등록했습니다.");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SuccessResponse.of("질문을 성공적으로 등록했습니다.", response));
    }
}
