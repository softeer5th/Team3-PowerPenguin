package com.softeer.reacton.domain.professor;

import com.softeer.reacton.global.config.CookieConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/professors")
@Tag(name = "Professor API", description = "교수 사용자 관련 API")
@RequiredArgsConstructor
@Validated
public class ProfessorController {

    private final ProfessorService professorService;
    private final CookieConfig cookieConfig;

    @PostMapping("/signup")
    @Operation(
            summary = "사용자 등록",
            description = "사용자 정보를 기반으로 회원가입 과정을 수행합니다.",
            responses = {
                    @ApiResponse(responseCode = "201", description = "성공적으로 생성되었습니다."),
                    @ApiResponse(responseCode = "409", description = "이미 가입된 사용자입니다."),
                    @ApiResponse(responseCode = "500", description = "서버와의 연결에 실패했습니다.")
            }
    )
    public ResponseEntity<Void> signUp(
            @RequestParam("name") @Pattern(regexp = "^[가-힣a-zA-Z]{1,20}$", message = "이름은 한글 또는 영문만 1~20자 입력 가능합니다.") String name,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImageFile,
            HttpServletRequest request) {
        String oauthId = (String) request.getAttribute("oauthId");
        String email = (String) request.getAttribute("email");
        boolean isSignedUp = (boolean) request.getAttribute("isSignedUp");

        String newAccessToken = professorService.signUp(name, profileImageFile, oauthId, email, isSignedUp);
        ResponseCookie jwtCookie = ResponseCookie.from("access_token", newAccessToken)
                .httpOnly(true)
                .secure(false) // TODO : HTTP에서도 쿠키 전송 가능하도록 설정 (배포 환경에서는 true로 변경)
                .path("/")
                .maxAge(cookieConfig.getAuthExpiration())
                .sameSite("Strict")
                .build();

        // TODO : 프론트 리다이렉트 코드 추가 예정

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .build();
    }

}
