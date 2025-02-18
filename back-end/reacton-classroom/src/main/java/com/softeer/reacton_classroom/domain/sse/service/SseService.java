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
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeoutException;

@Slf4j
@Service
public class SseService {

    private final Map<String, Sinks.Many<MessageResponse>> courseSinks = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> courseStudentMap = new ConcurrentHashMap<>();
    private final int MAX_CONNECTION_TIMEOUT_MINUTES = 10;

    public Flux<ServerSentEvent<MessageResponse>> subscribeCourseMessages(String courseId) {
        Sinks.Many<MessageResponse> sink = courseSinks.computeIfAbsent(courseId, k -> Sinks.many().multicast().onBackpressureBuffer());
        courseStudentMap.computeIfAbsent(courseId, k -> ConcurrentHashMap.newKeySet());

        log.debug("교수와 연결 가능한 SSE 통신을 찾았습니다.");
        return openCourseConnection(sink, courseId);
    }

    public Flux<ServerSentEvent<MessageResponse>> subscribeStudentMessages(String studentId, String courseId) {
        if (!courseStudentMap.containsKey(courseId)) {
            log.debug("courseId와 일치하는 수업을 찾을 수 없습니다.");
            return Flux.empty();
        }
        Sinks.Many<MessageResponse> sink = courseSinks.computeIfAbsent(studentId, k -> Sinks.many().multicast().onBackpressureBuffer());
        courseStudentMap.get(courseId).add(studentId);

        log.debug("학생과 연결 가능한 SSE 통신을 찾았습니다.");
        return openStudentConnection(sink, studentId, courseId);
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

    private Flux<ServerSentEvent<MessageResponse>> openCourseConnection(Sinks.Many<MessageResponse> sink, String courseId) {
        return sink.asFlux()
                .map(data -> ServerSentEvent.builder(data).build())
                .timeout(Duration.ofMinutes(MAX_CONNECTION_TIMEOUT_MINUTES))
                .onErrorResume(TimeoutException.class, e -> {
                    // TODO: 프론트 측에서 자동 재연결 요청 기능 추가 필요
                    log.warn("SSE 연결 제한 시간이 초과되었습니다. : courseId={}", courseId);
                    closeConnection(sink, courseId);
                    return Flux.empty();
                })
                .doOnCancel(() -> {
                    log.debug("SSE 연결이 종료되었습니다. : courseId = {}", courseId);
                    closeCourseConnection(courseId);
                });
    }

    private Flux<ServerSentEvent<MessageResponse>> openStudentConnection(Sinks.Many<MessageResponse> sink, String studentId, String courseId) {
        return sink.asFlux()
                .map(data -> ServerSentEvent.builder(data).build())
                .timeout(Duration.ofMinutes(MAX_CONNECTION_TIMEOUT_MINUTES))
                .onErrorResume(TimeoutException.class, e -> {
                    // TODO: 프론트 측에서 자동 재연결 요청 기능 추가 필요
                    log.warn("학생 SSE 연결 제한 시간이 초과되었습니다. : studentId={}", studentId);
                    closeConnection(sink, studentId);
                    return Flux.empty();
                })
                .doOnCancel(() -> {
                    log.debug("SSE 연결이 종료되었습니다. : studentId = {}", studentId);
                    closeStudentConnection(studentId, courseId);
                });
    }

    private void closeCourseConnection(String courseId) {
        Set<String> students = courseStudentMap.remove(courseId);

        if (students != null) {
            for (String studentId : students) {
                closeConnection(courseSinks.get(studentId), studentId);
            }
        }

        closeConnection(courseSinks.get(courseId), courseId);
    }

    private void closeStudentConnection(String studentId, String courseId) {
        Set<String> students = courseStudentMap.get(courseId);
        if (students != null) {
            students.remove(studentId);
        }
        closeConnection(courseSinks.get(studentId), studentId);
    }

    private void closeConnection(Sinks.Many<MessageResponse> sink, String courseId) {
        courseSinks.remove(courseId);
        sink.tryEmitComplete();
    }
}

