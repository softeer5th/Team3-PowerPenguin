package com.softeer.reacton.global.oauth;

import com.softeer.reacton.global.oauth.dto.OAuthLoginResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oauthService;

    @GetMapping("/{provider}/url")
    public ResponseEntity<Void> getOauthLoginUrl(@PathVariable String provider) {
        String oauthLoginUrl = oauthService.getOauthLoginUrl(provider);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, oauthLoginUrl)
                .build();
    }

    @GetMapping("/{provider}/callback")
    public ResponseEntity<Void> oauthCallback(@PathVariable String provider, @RequestParam String code) {
        OAuthLoginResult loginResult = oauthService.processOauthLogin(provider, code);

        ResponseCookie jwtCookie = ResponseCookie.from("access_token", loginResult.getAccessToken())
                .httpOnly(true)
                .secure(false) // TODO : HTTP에서도 쿠키 전송 가능하도록 설정 (배포 환경에서는 true로 변경)
                .path("/")
                .maxAge(60 * 60 * 24)
                .sameSite("Strict")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        // TODO : 프론트 리다이렉트 코드 추가 예정

        return loginResult.isSignedUp()
                ? ResponseEntity.ok().headers(headers).build()
                : ResponseEntity.status(HttpStatus.ACCEPTED).headers(headers).build();
    }
}
