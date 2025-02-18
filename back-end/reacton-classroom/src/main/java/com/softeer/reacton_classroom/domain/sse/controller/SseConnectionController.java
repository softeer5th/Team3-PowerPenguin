package com.softeer.reacton_classroom.domain.sse.controller;

import com.softeer.reacton_classroom.domain.sse.dto.MessageResponse;
import com.softeer.reacton_classroom.domain.sse.service.SseService;
import jakarta.servlet.http.HttpServletRequest;
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
    public Flux<ServerSentEvent<MessageResponse>> subscribeCourse(@PathVariable String courseId) {
        log.debug("교수 SSE 연결을 요청합니다. : courseId = {}", courseId);
        return sseService.subscribeCourseMessages(courseId);
    }

    @GetMapping(path = "/student", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<MessageResponse>> subscribeStudent(HttpServletRequest request) {
        String studentId = (String) request.getAttribute("studentId");
        Long courseId = (Long) request.getAttribute("courseId");

        log.debug("학생 SSE 연결을 요청합니다. : studentId = {}, courseId = {}", studentId, courseId);

        return sseService.subscribeStudentMessages(studentId, courseId.toString());
    }
}
