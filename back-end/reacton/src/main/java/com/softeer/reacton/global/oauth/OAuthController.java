package com.softeer.reacton.global.oauth;

import com.softeer.reacton.global.oauth.dto.LoginResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
public class OAuthController {

    private final OAuthService oauthService;

    public OAuthController(OAuthService oauthService) {
        this.oauthService = oauthService;
    }

    @GetMapping("/{provider}/url")
    public void getOauthLoginUrl(HttpServletResponse response, @PathVariable String provider) throws IOException {
        response.sendRedirect(oauthService.getOauthLoginUrl(provider));
    }
}
