package com.softeer.reacton.global.sse;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.SseErrorCode;
import com.softeer.reacton.global.sse.dto.SseMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
public class SseMessageSender {

    private final WebClient webClient;

    // TODO : 실제 배포 환경에 맞게 도메인 주소 변경
    private final String sseMessageBaseUrl = "http://localhost:8081/sse/message";

    public void sendMessageToProfessor(Long courseId, SseMessage<?> message) {
        String url = sseMessageBaseUrl + "/course/" + courseId;
        try {
            webClient.post()
                    .uri(url, courseId)
                    .bodyValue(message)
                    .retrieve()
                    .bodyToMono(Void.class)
                    .doOnSuccess(aVoid ->
                            log.debug("SSE 메시지 전송에 성공했습니다. : courseId = {}", courseId))
                    .retryWhen(Retry.backoff(2, Duration.ofSeconds(1))
                            .filter(throwable -> {
                                log.debug("재시도 중입니다.");
                                return throwable instanceof org.springframework.web.reactive.function.client.WebClientRequestException;
                            }))
                    .onErrorResume(error -> {
                        log.warn("SSE 메시지 전송에 실패했습니다. : courseId = {}, messageType = {}, error = {}",
                                courseId, message.getMessageType(), error.getMessage());
                        return Mono.empty();
                    })
                    .subscribe(); // 비동기적으로 처리
        } catch (Exception e) {
            log.error("SSE 메시지 전송 중 예외 발생: {}", e.getMessage(), e);
            throw new BaseException(SseErrorCode.MESSAGE_SEND_FAILURE);
        }
    }
}
