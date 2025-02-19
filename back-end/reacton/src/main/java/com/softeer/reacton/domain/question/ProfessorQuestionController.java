package com.softeer.reacton.domain.question;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/professors/questions")
@Tag(name = "Professor Questions API", description = "교수 질문 관련 API")
@RequiredArgsConstructor
public class ProfessorQuestionController {

    private final ProfessorQuestionService professorQuestionService;

    @PostMapping("/check/{questionId}")
    @Operation(
            summary = "교수 질문 체크 전송",
            description = "교수가 학생에게 질문 체크를 전송합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "성공적으로 전송했습니다."),
                    @ApiResponse(responseCode = "404", description = "수업을 찾을 수 없습니다."),
                    @ApiResponse(responseCode = "404", description = "질문을 찾을 수 없습니다."),
                    @ApiResponse(responseCode = "409", description = "아직 수업이 시작되지 않았습니다."),
                    @ApiResponse(responseCode = "500", description = "서버와의 연결에 실패했습니다.")
            }
    )
    public ResponseEntity<Void> checkQuestion(
            @PathVariable("questionId") Long questionId) {
        log.debug("교수 사용자가 질문 체크를 등록 및 전송합니다.");

        professorQuestionService.sendQuestionCheck(questionId);

        log.info("질문 체크를 성공적으로 등록했습니다.");

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }
}
