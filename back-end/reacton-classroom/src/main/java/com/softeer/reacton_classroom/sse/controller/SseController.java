package com.softeer.reacton_classroom.sse.controller;

import com.softeer.reacton_classroom.sse.dto.MessageResponse;
import com.softeer.reacton_classroom.sse.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/sse")
public class SseController {

    private final SseService sseService;

    @GetMapping(path = "/connection/course/{courseId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<MessageResponse>> subscribe(@PathVariable String courseId) {
        log.debug("SSE 연결을 요청합니다. : courseId = {}", courseId);
        return sseService.subscribeMessages(courseId);
    }

    @PostMapping("/message/course/{courseId}")
    public ResponseEntity<Void> sendMessage(@PathVariable String courseId, @RequestBody MessageResponse message) {
        log.debug("메시지 전송을 요청합니다. : courseId = {}", courseId);
        sseService.sendMessage(courseId, message);
        return ResponseEntity.ok().build();
    }
}

