package com.softeer.reacton_classroom.domain.sse.service;

import com.softeer.reacton_classroom.domain.sse.dto.MessageResponse;
import com.softeer.reacton_classroom.global.exception.BaseException;
import com.softeer.reacton_classroom.global.exception.code.SseErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeoutException;

@Slf4j
@Service
public class SseService {

    private final Map<String, Sinks.Many<MessageResponse<?>>> sinks = new ConcurrentHashMap<>();
    private final Map<String, Set<String>> courseStudentMap = new ConcurrentHashMap<>();
    private final int MAX_CONNECTION_TIMEOUT_MINUTES = 10;

    public Flux<ServerSentEvent<MessageResponse<?>>> subscribeCourseMessages(String courseId) {
        Sinks.Many<MessageResponse<?>> sink = sinks.computeIfAbsent(courseId, k -> Sinks.many().multicast().onBackpressureBuffer());
        courseStudentMap.computeIfAbsent(courseId, k -> ConcurrentHashMap.newKeySet());
        MessageResponse<?> initMessage = new MessageResponse<>("CONNECTION_ESTABLISHED", null);
        ServerSentEvent<MessageResponse<?>> initEvent = ServerSentEvent.<MessageResponse<?>>builder()
                .data(initMessage)
                .build();

        log.debug("교수와 연결 가능한 SSE 통신을 찾았습니다.");
        return openCourseConnection(sink, initEvent, courseId);
    }

    public Flux<ServerSentEvent<MessageResponse<?>>> subscribeStudentMessages(String studentId, String courseId) {
        if (!courseStudentMap.containsKey(courseId)) {
            log.debug("courseId와 일치하는 수업을 찾을 수 없습니다.");
            return Flux.empty();
        }
        Sinks.Many<MessageResponse<?>> sink = sinks.computeIfAbsent(studentId, k -> Sinks.many().multicast().onBackpressureBuffer());
        courseStudentMap.get(courseId).add(studentId);
        MessageResponse<?> initMessage = new MessageResponse<>("CONNECTION_ESTABLISHED", null);
        ServerSentEvent<MessageResponse<?>> initEvent = ServerSentEvent.<MessageResponse<?>>builder()
                .data(initMessage)
                .build();

        log.debug("학생과 연결 가능한 SSE 통신을 찾았습니다.");
        return openStudentConnection(sink, initEvent, studentId, courseId);
    }

    public void sendMessage(String id, MessageResponse<?> message) {
        Sinks.Many<MessageResponse<?>> sink = sinks.get(id);
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

    public void sendMessageToStudents(String courseId, MessageResponse<?> message) {
        for (String studentId : courseStudentMap.get(courseId)) {
            sendMessage(studentId, message);
        }
    }

    private Flux<ServerSentEvent<MessageResponse<?>>> openCourseConnection(Sinks.Many<MessageResponse<?>> sink, ServerSentEvent<MessageResponse<?>> initEvent, String courseId) {
        return Flux.concat(Mono.just(initEvent),
                        sink.asFlux()
                                .map(data -> ServerSentEvent.<MessageResponse<?>>builder(data).build())
                )
                .timeout(Duration.ofMinutes(MAX_CONNECTION_TIMEOUT_MINUTES))
                .onErrorResume(TimeoutException.class, e -> {
                    log.warn("SSE 연결 제한 시간이 초과되었습니다. : courseId={}", courseId);
                    closeConnection(sink, courseId);
                    return Flux.empty();
                })
                .doOnCancel(() -> {
                    log.debug("SSE 연결이 종료되었습니다. : courseId = {}", courseId);
                    closeCourseConnection(courseId);
                });
    }

    private Flux<ServerSentEvent<MessageResponse<?>>> openStudentConnection(Sinks.Many<MessageResponse<?>> sink, ServerSentEvent<MessageResponse<?>> initEvent, String studentId, String courseId) {
        return Flux.concat(Mono.just(initEvent),
                        sink.asFlux()
                                .map(data -> ServerSentEvent.<MessageResponse<?>>builder(data).build())
                )
                .timeout(Duration.ofMinutes(MAX_CONNECTION_TIMEOUT_MINUTES))
                .onErrorResume(TimeoutException.class, e -> {
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
                closeConnection(sinks.get(studentId), studentId);
            }
        }

        closeConnection(sinks.get(courseId), courseId);
    }

    private void closeStudentConnection(String studentId, String courseId) {
        Set<String> students = courseStudentMap.get(courseId);
        if (students != null) {
            students.remove(studentId);
        }
        closeConnection(sinks.get(studentId), studentId);
    }

    private void closeConnection(Sinks.Many<MessageResponse<?>> sink, String courseId) {
        sinks.remove(courseId);
        sink.tryEmitComplete();
    }
}
