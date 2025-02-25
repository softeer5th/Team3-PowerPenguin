package com.softeer.reacton_classroom.domain.sse;

import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class SseConnectionTest {

    private final String PROFESSOR_ACCESS_TOKEN = "";
    private final String URL = "https://softeer-reacton.shop/api";

    private HttpClient client;

    @BeforeAll
    void setupAll() {
        client = HttpClient.newHttpClient();
        System.out.println("테스트 셋업 완료");
    }

    @Test
    void testSseConnectionTest() throws Exception {
        System.out.println("SSE 연결 부하 테스트");

        int maxConnections = 10000;
        List<CompletableFuture<HttpResponse<String>>> connectionFutures = new ArrayList<>();

        for (int courseId = 1; courseId <= maxConnections; courseId++) {
            String url = URL + "/sse/connection/course/" + (1000 + courseId);
            HttpRequest connectionRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Cookie", "access_token=" + PROFESSOR_ACCESS_TOKEN + "; Path=/; Domain=.softeer-reacton.shop; Secure; HttpOnly; SameSite=Strict")
                    .GET()
                    .build();

            // 비동기로 요청을 보내고, SSE 연결 응답을 기다림
            CompletableFuture<HttpResponse<String>> future = client.sendAsync(connectionRequest, HttpResponse.BodyHandlers.ofString());
            connectionFutures.add(future);
            if (courseId % 100 == 0) {
                System.out.println(courseId + "개의 요청을 보낸 상태입니다.");
                Thread.sleep(10000);
            }
        }

        Thread.sleep(3600000);

        System.out.println("대기 종료");
    }

    @AfterAll
    void tearDownAll() {
        System.out.println("전체 테스트 종료");
    }
}
