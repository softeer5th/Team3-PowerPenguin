package com.softeer.reacton.domain.classroom;

import com.softeer.reacton.domain.classroom.dto.ClassroomQuestionResponse;
import com.softeer.reacton.domain.course.Course;
import com.softeer.reacton.domain.course.CourseRepository;
import com.softeer.reacton.domain.course.dto.CourseQuestionResponse;
import com.softeer.reacton.domain.question.Question;
import com.softeer.reacton.domain.question.QuestionRepository;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentClassroomService {

    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;

    @Transactional(readOnly = true)
    public ClassroomQuestionResponse getQuestionsByStudentId(String studentId, Long courseId) {
        log.debug("이전에 질문했던 목록을 조회합니다. : studentId = {}, courseId = {}", studentId, courseId);

        Course course = getCourse(courseId);
        List<CourseQuestionResponse> questions = findQuestions(studentId, course);

        return ClassroomQuestionResponse.of(questions);
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
}
