package com.softeer.reacton_classroom.sse.service;

import com.softeer.reacton_classroom.sse.dto.MessageResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class SseService {

    private final Map<String, Sinks.Many<MessageResponse>> courseSinks = new ConcurrentHashMap<>();

    public Flux<ServerSentEvent<MessageResponse>> subscribeMessages(String courseId) {
        Sinks.Many<MessageResponse> sink = courseSinks.computeIfAbsent(courseId, k -> Sinks.many().multicast().onBackpressureBuffer());

        log.debug("연결 가능한 SSE 통신을 찾았습니다.");
        return sink.asFlux()
                .map(data -> ServerSentEvent.builder(data).build())
                .doOnCancel(() -> courseSinks.remove(courseId));
    }

    public void sendMessage(String courseId, MessageResponse message) {
        Sinks.Many<MessageResponse> sink = courseSinks.get(courseId);

        // TODO: 사용자를 찾지 못했을 경우 예외 처리
        if (sink != null) {
            sink.tryEmitNext(message);
            log.info("메시지 전송에 성공했습니다.");
        }
    }
}

