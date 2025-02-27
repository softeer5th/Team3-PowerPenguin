package com.softeer.reacton.domain.reaction;

import com.softeer.reacton.domain.course.Course;
import com.softeer.reacton.domain.course.CourseRepository;
import com.softeer.reacton.domain.reaction.dto.ReactionSendRequest;
import com.softeer.reacton.domain.reaction.dto.ReactionSseRequest;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import com.softeer.reacton.global.sse.SseMessageSender;
import com.softeer.reacton.global.sse.dto.SseMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentReactionService {

    private final CourseRepository courseRepository;
    private final SseMessageSender sseMessageSender;

    public void sendReaction(Long courseId, ReactionSendRequest reactionSendRequest) {
        String content = reactionSendRequest.getContent();
        log.debug("반응 처리를 시작합니다. : content = {}", content);

        Course course = getCourse(courseId);
        checkIfOpen(course);

        ReactionSseRequest reactionSseRequest = new ReactionSseRequest(content);

        log.debug("SSE 서버에 반응 전송을 요청합니다.");
        SseMessage<ReactionSseRequest> sseMessage = new SseMessage<>("REACTION", reactionSseRequest);
        sseMessageSender.sendMessage(courseId.toString(), sseMessage);
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
