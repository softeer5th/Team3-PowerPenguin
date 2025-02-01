package com.softeer.reacton.global.oauth;


import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class OAuthController {

    private final OAuthService oAuthService;

    public OAuthController(OAuthService oAuthService) {
        this.oAuthService = oAuthService;
    }

    @GetMapping("/oauth/login")
    public ResponseEntity<String> login() {
        String googleAuthUrl = oAuthService.getAuthUrl();
        return ResponseEntity.status(HttpStatus.FOUND).header(HttpHeaders.LOCATION, googleAuthUrl).build();
    }

    // 구글로부터 인가(code)를 받으면 이를 이용해 access token 요청
    // 구글 로그인에 성공했으면 redirect-path에 설정된 주소로 자동으로 redirect된다.
    @GetMapping("${app.oauth.redirect-path}")
    public ResponseEntity<String> callback(@RequestParam("code") String code, HttpServletResponse response) {
        oAuthService.authenticate(code, response);
        return ResponseEntity.ok("Login successful");
    }
}
