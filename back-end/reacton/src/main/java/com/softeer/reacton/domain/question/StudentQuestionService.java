package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.course.Course;
import com.softeer.reacton.domain.course.CourseRepository;
import com.softeer.reacton.domain.course.dto.CourseQuestionResponse;
import com.softeer.reacton.domain.question.dto.QuestionAllResponse;
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

    @Transactional(readOnly = true)
    public QuestionAllResponse getQuestionsByStudentId(String studentId, Long courseId) {
        log.debug("이전에 질문했던 목록을 조회합니다. : studentId = {}, courseId = {}", studentId, courseId);

        Course course = getCourse(courseId);
        List<CourseQuestionResponse> questions = findQuestions(studentId, course);

        return QuestionAllResponse.of(questions);
    }

    @Transactional
    public CourseQuestionResponse sendQuestion(String studentId, Long courseId, String content) {
        log.debug("질문 처리를 시작합니다. : content = {}", content);

        Course course = getCourse(courseId);
        checkIfOpen(course);

        Question question = Question.builder()
                .studentId(studentId)
                .content(content)
                .course(course)
                .build();

        log.debug("질문을 저장합니다.");
        System.out.println("question.isComplete: " + question.getIsComplete());
        Question savedQuestion = questionRepository.save(question);

        CourseQuestionResponse questionDto = new CourseQuestionResponse(
                savedQuestion.getId(),
                savedQuestion.getCreatedAt(),
                savedQuestion.getContent()
        );

        log.debug("SSE 서버에 질문 전송을 요청합니다.");
        SseMessage<CourseQuestionResponse> sseMessage = new SseMessage<>("QUESTION", questionDto);
        sseMessageSender.sendMessageToProfessor(courseId, sseMessage);

        log.debug("질문 처리가 완료되었습니다.");
        return questionDto;
    }

    private Course getCourse(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new BaseException(CourseErrorCode.COURSE_NOT_FOUND));
    }

    private List<CourseQuestionResponse> findQuestions(String studentId, Course course) {
        List<Question> questions =  questionRepository.findByStudentIdAndCourse(studentId, course);

        return questions.stream()
                .map(question -> new CourseQuestionResponse(
                        question.getId(),
                        question.getCreatedAt(),
                        question.getContent()
                ))
                .collect(Collectors.toList());
    }

    private void checkIfOpen(Course course) {
        if (!course.isActive()) {
            throw new BaseException(CourseErrorCode.COURSE_NOT_ACTIVE);
        }
    }
}
