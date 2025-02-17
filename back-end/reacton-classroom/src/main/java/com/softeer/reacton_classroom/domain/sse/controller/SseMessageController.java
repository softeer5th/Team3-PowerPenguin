package com.softeer.reacton_classroom.domain.sse.controller;

import com.softeer.reacton_classroom.domain.sse.dto.MessageResponse;
import com.softeer.reacton_classroom.domain.sse.service.SseService;
import com.softeer.reacton_classroom.global.dto.SuccessResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/sse/message")
public class SseMessageController {

    private final SseService sseService;

    @PostMapping("/course/{courseId}")
    public ResponseEntity<SuccessResponse> sendMessage(@PathVariable String courseId, @RequestBody MessageResponse message) {
        log.debug("메시지 전송을 요청합니다. : courseId = {}", courseId);
        sseService.sendMessage(courseId, message);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SuccessResponse.of("성공적으로 전송했습니다."));
    }
}
