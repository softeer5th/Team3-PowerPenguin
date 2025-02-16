package com.softeer.reacton.global.oauth;

import com.softeer.reacton.global.config.CookieConfig;
import com.softeer.reacton.global.oauth.dto.OAuthLoginResult;
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
@RequestMapping("/auth")
@Tag(name = "Auth API", description = "인증 관련 API")
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oauthService;
    private final CookieConfig cookieConfig;

    @Value("${frontend.base-url}")
    private String FRONTEND_BASE_URL;

    @GetMapping("/{provider}/url")
    @Operation(
            summary = "OAuth 로그인 요청",
            description = "OAuth 로그인 페이지로 이동하기 위한 요청을 처리합니다.",
            responses = {@ApiResponse(responseCode = "302", description = "OAuth 로그인 페이지로 이동합니다.")}
    )
    public ResponseEntity<Void> getOauthLoginUrl(@PathVariable String provider) {
        log.debug("OAuth 로그인 URL을 요청합니다.");

        String oauthLoginUrl = oauthService.getOauthLoginUrl(provider);

        log.info("OAuth 로그인 URL을 생성했습니다.");

        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header(HttpHeaders.LOCATION, oauthLoginUrl)
                .build();
    }

    @GetMapping("/{provider}/callback")
    @Operation(
            summary = "OAuth 로그인 후 콜백",
            description = "OAuth 인증이 완료된 후, 인증 코드를 받아 액세스 토큰을 생성하고 클라이언트에 반환합니다. 회원가입 여부에 따라 별도의 응답으로 처리합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "로그인에 성공했습니다."),
                    @ApiResponse(responseCode = "202", description = "회원가입이 필요합니다."),
                    @ApiResponse(responseCode = "401", description = "인증되지 않은 접근입니다."),
                    @ApiResponse(responseCode = "500", description = "서버와의 연결에 실패했습니다.")
            }
    )
    public ResponseEntity<Void> oauthCallback(@PathVariable String provider, @RequestParam String code) {
        log.debug("OAuth 콜백 요청에 대한 처리를 시작합니다.");

        OAuthLoginResult loginResult = oauthService.processOauthLogin(provider, code);
        boolean isSignedUp = loginResult.isSignedUp();

        ResponseCookie jwtCookie = ResponseCookie.from("access_token", loginResult.getAccessToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(isSignedUp ? cookieConfig.getAuthExpiration() : cookieConfig.getSignupExpiration())
                .sameSite("Strict")
                .domain(cookieConfig.getDomain())
                .build();
        log.debug("JWT 쿠키 설정이 완료되었습니다. : isSignedUp = {}", isSignedUp);

        ResponseEntity.BodyBuilder response = ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        log.debug(FRONTEND_BASE_URL);
        String redirectUrl = isSignedUp ? "professor/loading" : "professor/register";

        return response.header(HttpHeaders.LOCATION, FRONTEND_BASE_URL + redirectUrl).build();
    }
}
