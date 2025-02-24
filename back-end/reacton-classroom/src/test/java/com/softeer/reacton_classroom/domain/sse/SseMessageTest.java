package com.softeer.reacton_classroom.domain.sse;

import org.junit.jupiter.api.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalTime;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SseMessageTest {
    private HttpClient client;

    @BeforeAll
    void setupAll() {
        client = HttpClient.newHttpClient();
        System.out.println("테스트 셋업 완료");
    }

    @Test
    void testSseMessageSend() throws Exception {
        System.out.println("SSE 메시지 전송 부하 테스트");

        LocalTime startTime = LocalTime.now();
        LocalTime currentTime = startTime;

        for (int i = 1; i <= 500; i++) {
            String jsonBody = String.format(
                    "{\"messageType\":\"QUESTION\",\"data\":{\"id\":%d,\"createdAt\":\"%s\",\"content\":\"이것은 질문입니까?\"}}",
                    i, currentTime);

            HttpRequest messageRequest = HttpRequest.newBuilder()
                    // uri와 일치하는 수업의 SSE connection이 열린 상태여야 함
                    .uri(URI.create("https://softeer-reacton.shop/api/sse/message/course/14"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> messageResponse = client.send(messageRequest, HttpResponse.BodyHandlers.ofString());

            Assertions.assertTrue(messageResponse.statusCode() == 200 || messageResponse.statusCode() == 201,
                    "메시지 전송 실패 at iteration " + i);
            currentTime = LocalTime.now();
        }

        Duration totalTime = Duration.between(startTime, currentTime);
        System.out.println("전체 500개 메시지 전송 완료까지 총 처리 시간: " + totalTime.toMillis() + " ms");
        System.out.println("SSE 메시지 전송 종료");
    }

    @AfterAll
    void tearDownAll() {
        System.out.println("전체 테스트 종료");
    }
}
