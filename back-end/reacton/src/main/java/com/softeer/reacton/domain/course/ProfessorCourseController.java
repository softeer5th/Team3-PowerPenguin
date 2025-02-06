package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.dto.CourseCreateRequest;
import com.softeer.reacton.global.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<SuccessResponse<Map<String, String>>> createCourse(HttpServletRequest request, @RequestBody CourseCreateRequest courseCreateRequest) {
        String oauthId = (String) request.getAttribute("oauthId");

        long courseId = professorCourseService.createCourse(oauthId, courseCreateRequest);
        log.info("수업을 생성하고 DB에 저장했습니다. : courseId = {}", courseId);

        Map<String, String> response = new HashMap<>();
        response.put("courseId", String.valueOf(courseId));

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(SuccessResponse.of("수업이 생성되었습니다.", response));
    }
}
