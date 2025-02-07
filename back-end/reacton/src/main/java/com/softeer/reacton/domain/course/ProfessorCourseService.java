package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.dto.CourseRequest;
import com.softeer.reacton.domain.professor.Professor;
import com.softeer.reacton.domain.professor.ProfessorRepository;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import com.softeer.reacton.global.exception.code.ProfessorErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfessorCourseService {
    private final ProfessorRepository professorRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public long createCourse(String oauthId, CourseRequest request) {
        log.debug("수업을 생성합니다.");
        if (request == null) {
            log.warn("수업 생성 요청 데이터가 null입니다. : 'request' is null.");
            throw new BaseException(CourseErrorCode.COURSE_REQUEST_IS_NULL);
        }

        Professor professor = professorRepository.findByOauthId(oauthId)
                .orElseThrow(() -> new BaseException(ProfessorErrorCode.PROFESSOR_NOT_FOUND));

        SecureRandom secureRandom = new SecureRandom();
        int accessCode = 100000 + secureRandom.nextInt(900000);
        log.debug("입장코드용 랜덤한 6자리 숫자를 생성합니다 : accessCode = {}", accessCode);

        Course course = Course.create(request, accessCode, professor);
        long courseId = courseRepository.save(course).getId();
        log.info("수업이 생성되었습니다. : courseId = {}", courseId);

        return courseId;
    }

    @Transactional
    public void updateCourse(String oauthId, long courseId, CourseRequest request) {
        log.debug("수업 데이터를 업데이트합니다. : courseId = {}", courseId);

        if (request == null) {
            log.warn("수업 수정 요청 데이터가 null입니다. : 'request' is null.");
            throw new BaseException(CourseErrorCode.COURSE_REQUEST_IS_NULL);
        }

        Course course = findCourseByProfessor(oauthId, courseId);

        course.update(request);

        log.info("수업 업데이트가 완료되었습니다. : courseId = {}", courseId);
    }

    @Transactional
    public void deleteCourse(String oauthId, long courseId) {
        log.debug("수업을 삭제합니다. : courseId = {}", courseId);

        Course course = findCourseByProfessor(oauthId, courseId);

        courseRepository.delete(course);
        courseRepository.flush();

        log.info("수업이 삭제되었습니다. : courseId = {}", courseId);
    }

    @Transactional
    public void startCourse(String oauthId, long courseId) {
        Course course = findCourseByProfessor(oauthId, courseId);
        if (course.isActive()) {
            throw new BaseException(CourseErrorCode.COURSE_ALREADY_ACTIVE);
        }
        course.setActive(true);
    }

    @Transactional
    public void closeCourse(String oauthId, long courseId) {

        Course course = findCourseByProfessor(oauthId, courseId);
        if (!course.isActive()) {
            throw new BaseException(CourseErrorCode.COURSE_ALREADY_INACTIVE);
        }
        course.setActive(false);

    }

    private Course findCourseByProfessor(String oauthId, long courseId) {
        Professor professor = professorRepository.findByOauthId(oauthId)
                .orElseThrow(() -> new BaseException(ProfessorErrorCode.PROFESSOR_NOT_FOUND));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new BaseException(CourseErrorCode.COURSE_NOT_FOUND));

        if (!course.getProfessor().getId().equals(professor.getId())) {
            throw new BaseException(CourseErrorCode.UNAUTHORIZED_PROFESSOR);
        }

        return course;
    }

}
