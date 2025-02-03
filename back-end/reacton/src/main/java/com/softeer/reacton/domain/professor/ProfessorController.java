package com.softeer.reacton.domain.professor;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/professors")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;

    @PostMapping("/signup")
    public ResponseEntity<Void> signUp(
            @RequestParam("name") String name,
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
                .maxAge(60 * 60 * 24)
                .sameSite("Strict")
                .build();

        // TODO : 프론트 리다이렉트 코드 추가 예정

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .build();
    }

}
