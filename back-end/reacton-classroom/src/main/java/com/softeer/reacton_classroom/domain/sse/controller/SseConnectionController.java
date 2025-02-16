package com.softeer.reacton_classroom.domain.sse.controller;

import com.softeer.reacton_classroom.domain.sse.dto.MessageResponse;
import com.softeer.reacton_classroom.domain.sse.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/sse/connection")
public class SseConnectionController {

    private final SseService sseService;

    @GetMapping(path = "/course/{courseId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<MessageResponse>> subscribe(@PathVariable String courseId) {
        log.debug("SSE 연결을 요청합니다. : courseId = {}", courseId);
        return sseService.subscribeMessages(courseId);
    }
}
