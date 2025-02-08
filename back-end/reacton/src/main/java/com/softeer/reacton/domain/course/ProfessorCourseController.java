package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.dto.CourseRequest;
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
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/professors/courses")
@Tag(name = "Professor Course API", description = "교수 수업 관련 API")
@RequiredArgsConstructor
public class ProfessorCourseController {
    private final ProfessorCourseService professorCourseService;

    @PostMapping
    @Operation(
            summary = "수업 생성 요청",
            description = "수업 데이터를 받아 데이터베이스 저장하고 courseId를 반환합니다.",
            responses = {@ApiResponse(responseCode = "201", description = "수업이 생성되었습니다.")}
    )
    public ResponseEntity<SuccessResponse<Map<String, String>>> createCourse(HttpServletRequest request, @RequestBody @Valid CourseRequest courseRequest) {
        String oauthId = (String) request.getAttribute("oauthId");

        long courseId = professorCourseService.createCourse(oauthId, courseRequest);

        Map<String, String> response = new HashMap<>();
        response.put("courseId", String.valueOf(courseId));

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(SuccessResponse.of("수업이 생성되었습니다.", response));
    }

    @PutMapping("/{courseId}")
    @Operation(
            summary = "수업 수정 요청",
            description = "수업 데이터를 기존 데이터에 업데이트하고 courseId를 반환합니다.",
            responses = {@ApiResponse(responseCode = "200", description = "수업이 수정되었습니다.")}
    )
    public ResponseEntity<SuccessResponse<Map<String, String>>> updateCourse(
            HttpServletRequest request,
            @PathVariable(value = "courseId") long courseId,
            @RequestBody @Valid CourseRequest courseRequest) {
        String oauthId = (String) request.getAttribute("oauthId");
        professorCourseService.updateCourse(oauthId, courseId, courseRequest);

        Map<String, String> response = new HashMap<>();
        response.put("courseId", String.valueOf(courseId));

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SuccessResponse.of("수업이 수정되었습니다.", response));
    }

    @DeleteMapping("/{courseId}")
    @Operation(
            summary = "수업 삭제 요청",
            description = "courseId에 해당하는 수업을 삭제합니다.",
            responses = {@ApiResponse(responseCode = "204", description = "수업이 삭제되었습니다.")}
    )
    public ResponseEntity<Void> deleteCourse(HttpServletRequest request, @PathVariable(value = "courseId") long courseId) {
        String oauthId = (String) request.getAttribute("oauthId");
        professorCourseService.deleteCourse(oauthId, courseId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{courseId}/start")
    @Operation(
            summary = "수업 시작 상태로 변경",
            description = "courseId에 해당하는 수업을 시작 상태로 변경합니다.",
            responses = {@ApiResponse(responseCode = "204", description = "수업이 시작 상태로 변경되었습니다.")}
    )
    public ResponseEntity<Void> startCourse(HttpServletRequest request, @PathVariable(value = "courseId") long courseId) {
        String oauthId = (String) request.getAttribute("oauthId");
        professorCourseService.startCourse(oauthId, courseId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{courseId}/close")
    @Operation(
            summary = "수업 종료 상태로 변경",
            description = "courseId에 해당하는 수업을 종료 상태로 변경합니다.",
            responses = {@ApiResponse(responseCode = "204", description = "수업이 종료 상태로 변경되었습니다.")}
    )
    public ResponseEntity<Void> closeCourse(HttpServletRequest request, @PathVariable(value = "courseId") long courseId) {
        String oauthId = (String) request.getAttribute("oauthId");
        professorCourseService.closeCourse(oauthId, courseId);

        return ResponseEntity.noContent().build();
    }

}