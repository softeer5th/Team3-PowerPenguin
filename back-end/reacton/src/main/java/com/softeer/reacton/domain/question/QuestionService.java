package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.course.Course;
import com.softeer.reacton.domain.course.CourseRepository;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import com.softeer.reacton.global.exception.code.QuestionErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final CourseRepository courseRepository;
    private final QuestionRepository questionRepository;

    @Transactional
    public Question checkQuestion(Long questionId) {
        Question question = getQuestion(questionId);
        Course course = question.getCourse();
        checkIfOpen(course);

        question.setIsComplete(true);
        log.debug("질문을 체크합니다. : questionId = {}", questionId);
        return questionRepository.save(question);
    }

    @Transactional
    public Question saveQuestion(String studentId, String content, Long courseId) {
        Course course = getCourse(courseId);
        checkIfOpen(course);

        Question question = Question.builder()
                .studentId(studentId)
                .content(content)
                .course(course)
                .build();

        log.debug("질문을 저장합니다. : questionId = {}", question.getId());
        return questionRepository.save(question);
    }

    private Question getQuestion(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new BaseException(QuestionErrorCode.QUESTION_NOT_FOUND));
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
