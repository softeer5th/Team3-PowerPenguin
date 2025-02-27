package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.dto.CourseSummaryResponse;
import com.softeer.reacton.global.config.CookieConfig;
import com.softeer.reacton.global.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/students/courses")
@Tag(name = "Student API", description = "학생 사용자 관련 API")
public class StudentCourseController {

    private final StudentCourseService studentCourseService;
    private final CookieConfig cookieConfig;

    @Value("${frontend.base-url}")
    private String FRONTEND_BASE_URL;

    @GetMapping("/{accessCode}/summary")
    @Operation(
            summary = "학생 수업 정보 조회",
            description = "학생이 입력한 수업 코드에 해당하는 수업 정보를 조회합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "성공적으로 조회했습니다."),
                    @ApiResponse(responseCode = "404", description = "수업을 찾을 수 없습니다."),
                    @ApiResponse(responseCode = "409", description = "아직 수업이 시작되지 않았습니다."),
                    @ApiResponse(responseCode = "500", description = "서버와의 연결에 실패했습니다.")
            }
    )
    public ResponseEntity<SuccessResponse<CourseSummaryResponse>> getCourseByAccessCode(
            @PathVariable("accessCode") int accessCode
    ) {
        log.debug("입장 코드와 일치하는 수업 조회를 요청합니다. : accessCode = {}", accessCode);

        CourseSummaryResponse response = studentCourseService.getCourseByAccessCode(accessCode);

        log.info("입장 코드와 일치하는 수업을 성공적으로 조회했습니다.");

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SuccessResponse.of("성공적으로 조회했습니다.", response));
    }

    @PostMapping("/{accessCode}/in")
    @Operation(
            summary = "학생 수업 참가 요청",
            description = "학생이 입력한 수업 코드에 해당하는 수업 참가를 요청합니다.",
            responses = {
                    @ApiResponse(responseCode = "303", description = "수업 참여를 위해 강의실로 이동합니다.")
            }
    )
    public ResponseEntity<Void> registerCourse(
            @PathVariable("accessCode") int accessCode
    ) {
        log.debug("입장 코드와 일치하는 수업 참여를 요청합니다. : accessCode = {}", accessCode);

        String newAccessToken = studentCourseService.registerCourse(accessCode);
        ResponseCookie jwtCookie = ResponseCookie.from("student_access_token", newAccessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(cookieConfig.getStudentAccessExpiration())
                .sameSite("Strict")
                .domain(cookieConfig.getDomain())
                .build();

        log.info("수업 참여에 성공했습니다.");

        return ResponseEntity
                .status(HttpStatus.SEE_OTHER)
                .header(HttpHeaders.LOCATION, FRONTEND_BASE_URL + "student/course")
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .build();
    }
}
