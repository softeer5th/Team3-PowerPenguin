package com.softeer.reacton_classroom.domain.sse.controller;

import com.softeer.reacton_classroom.domain.sse.dto.MessageResponse;
import com.softeer.reacton_classroom.domain.sse.service.SseService;
import com.softeer.reacton_classroom.global.dto.SuccessResponse;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(
            summary = "교수에게 SSE 메시지 전송 요청",
            description = "교수에게 SSE로 메시지 전송을 요청합니다."
    )
    @PostMapping("/course/{courseId}")
    public ResponseEntity<SuccessResponse> sendMessageToCourse(@PathVariable String courseId, @RequestBody MessageResponse<?> message) {
        log.debug("교수에게 메시지 전송을 요청합니다. : courseId = {}, type = {}", courseId, message.getMessageType());
        sseService.sendMessage(courseId, message);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SuccessResponse.of("성공적으로 전송했습니다."));
    }

    @Operation(
            summary = "학생에게 SSE 메시지 전송 요청",
            description = "학생에게 SSE로 메시지 전송을 요청합니다."
    )
    @PostMapping("/student/{studentId}")
    public ResponseEntity<SuccessResponse> sendMessageToStudent(@PathVariable String studentId, @RequestBody MessageResponse<?> message) {
        log.debug("학생에게 메시지 전송을 요청합니다. : studentId = {}, type = {}", studentId, message.getMessageType());
        sseService.sendMessage(studentId, message);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SuccessResponse.of("성공적으로 전송했습니다."));
    }
  
    @Operation(
            summary = "SSE 메시지 일괄 전송 요청",
            description = "SSE로 메시지 일괄 전송을 요청합니다."
    )
    @PostMapping("/students/{courseId}")
    public ResponseEntity<SuccessResponse> sendMessageToStudents(@PathVariable String courseId, @RequestBody MessageResponse<?> message) {
        log.debug("메시지 일괄 전송을 요청합니다. : courseId = {}, type = {}", courseId, message.getMessageType());
        sseService.sendMessageToStudents(courseId, message);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(SuccessResponse.of("성공적으로 전송했습니다."));
    }
}
