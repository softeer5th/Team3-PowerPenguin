package com.softeer.reacton_classroom.domain.sse.service;

import com.softeer.reacton_classroom.domain.sse.dto.MessageResponse;
import com.softeer.reacton_classroom.global.exception.BaseException;
import com.softeer.reacton_classroom.global.exception.code.SseErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeoutException;

@Slf4j
@Service
public class SseService {

    private final Map<String, Sinks.Many<MessageResponse>> courseSinks = new ConcurrentHashMap<>();
    private final int MAX_CONNECTION_TIMEOUT_MINUTES = 10;

    public Flux<ServerSentEvent<MessageResponse>> subscribeMessages(String courseId) {
        Sinks.Many<MessageResponse> sink = courseSinks.computeIfAbsent(courseId, k -> Sinks.many().multicast().onBackpressureBuffer());

        log.debug("연결 가능한 SSE 통신을 찾았습니다.");
        return openConnection(sink, courseId);
    }

    public void sendMessage(String courseId, MessageResponse message) {
        Sinks.Many<MessageResponse> sink = courseSinks.get(courseId);
        if (sink == null) {
            log.debug("전송 대상을 찾지 못했습니다. : Receiver not found.");
            throw new BaseException(SseErrorCode.USER_NOT_FOUND);
        }

        Sinks.EmitResult result = sink.tryEmitNext(message);
        if (result.isFailure()) {
            log.info("메시지 전송에 실패했습니다.");
            throw new BaseException(SseErrorCode.MESSAGE_SEND_FAILURE);
        }
        log.info("메시지 전송에 성공했습니다.");
    }

    private Flux<ServerSentEvent<MessageResponse>> openConnection(Sinks.Many<MessageResponse> sink, String courseId) {
        return sink.asFlux()
                .map(data -> ServerSentEvent.builder(data).build())
                .timeout(Duration.ofMinutes(MAX_CONNECTION_TIMEOUT_MINUTES))
                .onErrorResume(TimeoutException.class, e -> {
                    // TODO: 프론트 측에서 자동 재연결 요청 기능 추가 필요
                    log.warn("SSE 연결 제한 시간이 초과되었습니다: courseId={}", courseId);
                    closeConnection(sink, courseId);
                    return Flux.empty();
                })
                .doOnCancel(() -> {
                    log.debug("SSE 연결이 종료되었습니다. : courseId = {}", courseId);
                    closeConnection(sink, courseId);
                });
    }

    private void closeConnection(Sinks.Many<MessageResponse> sink, String courseId) {
        courseSinks.remove(courseId);
        sink.tryEmitComplete();
    }
}

