package com.softeer.reacton.global.oauth;

import com.softeer.reacton.global.oauth.dto.LoginResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oauthService;

    @GetMapping("/{provider}/url")
    public void getOauthLoginUrl(HttpServletResponse response, @PathVariable String provider) throws IOException {
        response.sendRedirect(oauthService.getOauthLoginUrl(provider));
    }

    @GetMapping("/{provider}/callback")
    public ResponseEntity<LoginResponse> oauthCallback(HttpServletResponse response, @PathVariable String provider, @RequestParam String code) {
        LoginResponse loginResponse = oauthService.processOauthLogin(provider, code);

        ResponseCookie jwtCookie = ResponseCookie.from("access_token", loginResponse.getAccessToken())
                .httpOnly(true)
                .secure(false) // HTTP에서도 쿠키 전송 가능하도록 설정 (배포 환경에서는 true로 변경)
                .path("/")
                .maxAge(60 * 60 * 24)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        // TODO : 프론트 리다이렉트 코드 추가 예정
        return ResponseEntity.ok(loginResponse);
    }
}
