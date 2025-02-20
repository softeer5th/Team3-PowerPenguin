package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.course.Course;
import com.softeer.reacton.domain.course.CourseRepository;
import com.softeer.reacton.domain.course.dto.CourseQuestionResponse;
import com.softeer.reacton.domain.question.dto.QuestionAllResponse;
import com.softeer.reacton.domain.question.dto.QuestionCheckSseRequest;
import com.softeer.reacton.domain.question.dto.QuestionSendRequest;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import com.softeer.reacton.global.sse.SseMessageSender;
import com.softeer.reacton.global.sse.dto.SseMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentQuestionService {

    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;
    private final SseMessageSender sseMessageSender;
    private final QuestionService questionService;

    @Transactional(readOnly = true)
    public QuestionAllResponse getQuestionsByStudentId(String studentId, Long courseId) {
        log.debug("이전에 질문했던 목록을 조회합니다. : studentId = {}, courseId = {}", studentId, courseId);

        Course course = getCourse(courseId);
        List<CourseQuestionResponse> questions = findQuestionsNotComplete(studentId, course);

        return QuestionAllResponse.of(questions);
    }

    public CourseQuestionResponse sendQuestion(String studentId, Long courseId, QuestionSendRequest questionSendRequest) {
        String content = questionSendRequest.getContent();
        log.debug("질문 처리를 시작합니다. : content = {}", content);

        Question question = questionService.saveQuestion(studentId, content, courseId);

        CourseQuestionResponse courseQuestionResponse = new CourseQuestionResponse(
                question.getId(),
                question.getCreatedAt(),
                question.getContent()
        );

        log.debug("SSE 서버에 질문 전송을 요청합니다.");
        SseMessage<CourseQuestionResponse> sseMessage = new SseMessage<>("QUESTION", courseQuestionResponse);
        sseMessageSender.sendMessage(courseId.toString(), sseMessage);

        log.debug("질문 처리가 완료되었습니다.");
        return courseQuestionResponse;
    }

    public void sendQuestionCheck(Long courseId, Long questionId) {
        log.debug("질문 체크 처리를 시작합니다. : questionId = {}", questionId);

        questionService.checkQuestion(questionId);

        QuestionCheckSseRequest questionCheckSseRequest = new QuestionCheckSseRequest(questionId);

        log.debug("SSE 서버에 질문 체크 전송을 요청합니다.");
        SseMessage<QuestionCheckSseRequest> sseMessage = new SseMessage<>("QUESTION_CHECK", questionCheckSseRequest);
        sseMessageSender.sendMessage(courseId.toString(), sseMessage);

        log.debug("질문 체크 처리가 완료되었습니다.");
    }

    private Course getCourse(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new BaseException(CourseErrorCode.COURSE_NOT_FOUND));
    }

    private List<CourseQuestionResponse> findQuestionsNotComplete(String studentId, Course course) {
        List<Question> questions =  questionRepository.findNotCompleteByStudentIdAndCourse(studentId, course);

        return questions.stream()
                .map(question -> new CourseQuestionResponse(
                        question.getId(),
                        question.getCreatedAt(),
                        question.getContent()
                ))
                .collect(Collectors.toList());
    }
}
