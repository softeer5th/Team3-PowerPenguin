package com.softeer.reacton.domain.reaction;

import com.softeer.reacton.domain.reaction.dto.ReactionSendRequest;
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
@RequestMapping("/students/reactions")
@Tag(name = "Student Reaction API", description = "학생 반응 관련 API")
@RequiredArgsConstructor
public class StudentReactionController {

    private final StudentReactionService studentReactionService;

    @PostMapping
    @Operation(
            summary = "학생 반응 전송",
            description = "학생이 교수에게 반응을 전송합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "성공적으로 전송했습니다."),
                    @ApiResponse(responseCode = "404", description = "수업을 찾을 수 없습니다."),
                    @ApiResponse(responseCode = "409", description = "아직 수업이 시작되지 않았습니다."),
                    @ApiResponse(responseCode = "500", description = "서버와의 연결에 실패했습니다.")
            }
    )
    public ResponseEntity<SuccessResponse<Void>> sendReaction(
            @Valid @RequestBody ReactionSendRequest reactionSendRequest,
                    HttpServletRequest request) {
        log.debug("학생 사용자가 반응 등록 및 전송을 요청합니다.");

        Long courseId = (Long) request.getAttribute("courseId");

        studentReactionService.sendReaction(courseId, reactionSendRequest);

        log.info("반응을 성공적으로 등록했습니다.");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SuccessResponse.of("반응을 성공적으로 등록했습니다."));
    }
}
