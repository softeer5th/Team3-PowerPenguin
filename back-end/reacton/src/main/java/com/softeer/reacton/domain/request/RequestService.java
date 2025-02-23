package com.softeer.reacton.domain.request;

import com.softeer.reacton.domain.course.Course;
import com.softeer.reacton.domain.course.CourseRepository;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import com.softeer.reacton.global.exception.code.RequestErrorCode;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class RequestService {

    private final CourseRepository courseRepository;
    private final RequestRepository requestRepository;

    @Transactional
    public void incrementRequestCount(String content, Long courseId) {
        Course course = getCourse(courseId);
        checkIfOpen(course);

        log.debug("요청을 저장합니다.");
        int updatedRows = requestRepository.incrementCount(course, content);
        if (updatedRows == 0) {
            log.debug("요청 데이터를 처리하는 과정에서 발생한 에러입니다. : Request does not exist.");
            throw new BaseException(RequestErrorCode.REQUEST_NOT_FOUND);
        }
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
