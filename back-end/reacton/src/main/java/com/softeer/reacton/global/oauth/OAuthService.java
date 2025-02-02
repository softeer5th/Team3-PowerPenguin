package com.softeer.reacton.global.oauth;

import com.softeer.reacton.domain.professor.Professor;
import com.softeer.reacton.domain.professor.ProfessorService;
import com.softeer.reacton.global.security.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Optional;

@Service
public class OAuthService {

    private final ProfessorService professorService;

    private static final String GOOGLE_AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/auth";
    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
    // 도메인 주소 (필요 시 수정)
    private final String AUTH_DOMAIN = "http://localhost:8080/auth";

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;

    public OAuthService(@Value("${app.oauth.client-id}") String clientId,
                        @Value("${app.oauth.client-secret}") String clientSecret,
                        @Value("${app.oauth.redirect-path}") String redirectUri,
                        ProfessorService professorService
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.professorService = professorService;
    }

    // google 로그인 url 생성
    public String getAuthUrl() {
        return GOOGLE_AUTH_BASE_URL +
                "?client_id=" + clientId +
                "&redirect_uri=" + AUTH_DOMAIN + redirectUri +
                "&response_type=code" +
                "&scope=email%20profile";
    }

    // 사용자 정보를 기반으로 JWT 토큰 생성 후 쿠키로 저장
    public void authenticate(String code, HttpServletResponse response) {
        String accessToken = getAccessToken(code);
        Map<String, Object> userInfo = getUserInfo(accessToken);

        if (userInfo == null) {
            throw new RuntimeException("Failed to fetch user info");
        }

        // 사용자 정보에서 sub(고유 ID)와 email 가져오기
        String oauthId = (String) userInfo.get("sub");
        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");

        // 신규 사용자일 경우 사용자 정보 저장
        Optional<Professor> result = professorService.findByOauthId(oauthId);
        if (result.isEmpty()) {
            professorService.save(oauthId, email, name);
        }

        // JWT 토큰 생성
        String jwtToken = JwtUtil.generateJwt(oauthId, email);

        // 쿠키에 저장
        Cookie cookie = new Cookie("JWT", jwtToken);
        cookie.setHttpOnly(true); // 클라이언트에서 접근 불가능
        cookie.setSecure(true); // HTTPS에서만 전송 (HTTP 환경에서는 쿠키가 전달되지 않음)
        cookie.setPath("/"); // 모든 경로에서 쿠키 사용 가능
        cookie.setMaxAge(24 * 60); // 1시간

        response.addCookie(cookie);
    }

    // authorization code로 access token 발급
    private String getAccessToken(String code) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", AUTH_DOMAIN + redirectUri);
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(TOKEN_URL, request, Map.class);

        return (String) response.getBody().get("access_token");
    }

    // access token으로 사용자 정보 조회
    private Map<String, Object> getUserInfo(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(USER_INFO_URL, HttpMethod.GET, entity, Map.class);

        return response.getBody();
    }
}
