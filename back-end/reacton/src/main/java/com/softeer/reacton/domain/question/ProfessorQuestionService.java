package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.course.Course;
import com.softeer.reacton.domain.question.dto.QuestionCheckSseRequest;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import com.softeer.reacton.global.exception.code.QuestionErrorCode;
import com.softeer.reacton.global.sse.SseMessageSender;
import com.softeer.reacton.global.sse.dto.SseMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfessorQuestionService {

    private final QuestionRepository questionRepository;
    private final SseMessageSender sseMessageSender;

    @Transactional
    public void sendQuestionCheck(Long questionId) {
        log.debug("질문 체크 처리를 시작합니다. : questionId = {}", questionId);

        Question question = getQuestion(questionId);
        Course course = question.getCourse();
        checkIfOpen(course);
        String studentId = question.getStudentId();

        question.setIsComplete(true);
        questionRepository.save(question);

        QuestionCheckSseRequest questionCheckSseRequest = new QuestionCheckSseRequest(questionId);

        log.debug("SSE 서버에 질문 체크 전송을 요청합니다.");
        SseMessage<QuestionCheckSseRequest> sseMessage = new SseMessage<>("QUESTION_CHECK", questionCheckSseRequest);
        sseMessageSender.sendMessage(studentId, sseMessage);

        log.debug("질문 체크 처리가 완료되었습니다.");
    }

    private Question getQuestion(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new BaseException(QuestionErrorCode.QUESTION_NOT_FOUND));
    }

    private Course getCourseByQuestionId(Long questionId) {
        Course course = questionRepository.getCourseById(questionId);
        if (course == null) {
            log.debug("질문 체크를 처리하는 과정에서 발생한 에러입니다. : Question does not exist.");
            throw new BaseException(QuestionErrorCode.QUESTION_NOT_FOUND);
        }
        return course;
    }

    private void checkIfOpen(Course course) {
        if (!course.isActive()) {
            throw new BaseException(CourseErrorCode.COURSE_NOT_ACTIVE);
        }
    }
}
