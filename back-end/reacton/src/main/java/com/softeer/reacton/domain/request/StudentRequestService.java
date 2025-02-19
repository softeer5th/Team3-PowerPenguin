package com.softeer.reacton.domain.request;

import com.softeer.reacton.domain.course.Course;
import com.softeer.reacton.domain.course.CourseRepository;
import com.softeer.reacton.domain.request.dto.RequestSseRequest;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import com.softeer.reacton.global.exception.code.RequestErrorCode;
import com.softeer.reacton.global.sse.SseMessageSender;
import com.softeer.reacton.global.sse.dto.SseMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentRequestService {

    private final CourseRepository courseRepository;
    private final RequestRepository requestRepository;
    private final SseMessageSender sseMessageSender;

    @Transactional
    public void sendRequest(Long courseId, String content) {
        log.debug("요청 처리를 시작합니다. : content = {}", content);

        Course course = getCourse(courseId);
        checkIfOpen(course);

        log.debug("요청을 저장합니다.");
        int updatedRows = requestRepository.incrementCount(courseId, content);
        if (updatedRows == 0) {
            log.debug("요청 데이터를 처리하는 과정에서 발생한 에러입니다. : Request does not exist.");
            throw new BaseException(RequestErrorCode.REQUEST_NOT_FOUND);
        }

        RequestSseRequest requestSseDto = new RequestSseRequest(content);

        log.debug("SSE 서버에 요청 전송을 요청합니다.");
        SseMessage<RequestSseRequest> sseMessage = new SseMessage<>("REQUEST", requestSseDto);
        sseMessageSender.sendMessageToProfessor(courseId, sseMessage);
    }

    private Course getCourse(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new BaseException(CourseErrorCode.COURSE_NOT_FOUND));
    }

    private void checkIfOpen(Course course) {
        if (!course.isActive()) {
            throw new BaseException(CourseErrorCode.COURSE_NOT_ACTIVE);
        }
    }
}
