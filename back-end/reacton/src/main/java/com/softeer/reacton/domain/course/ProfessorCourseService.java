package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.dto.*;
import com.softeer.reacton.domain.professor.Professor;
import com.softeer.reacton.domain.professor.ProfessorRepository;
import com.softeer.reacton.domain.question.Question;
import com.softeer.reacton.domain.request.Request;
import com.softeer.reacton.domain.schedule.Schedule;
import com.softeer.reacton.domain.schedule.ScheduleRepository;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import com.softeer.reacton.global.exception.code.ProfessorErrorCode;
import com.softeer.reacton.global.util.TimeUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfessorCourseService {
    private final ProfessorRepository professorRepository;
    private final CourseRepository courseRepository;
    private final ScheduleRepository scheduleRepository;

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

    public CourseDetailResponse getCourseDetail(long courseId, String oauthId) {
        log.debug("수업 상세 정보를 조회합니다.");

        Course course = findCourseByProfessor(oauthId, courseId);

        List<CourseScheduleResponse> schedules = getSchedulesByCourseId(courseId);
        List<CourseQuestionResponse> questions = getQuestionsByCourse(course);
        List<CourseRequestResponse> requests = getRequestsByCourse(course);

        log.debug("수업 상세 정보를 가져오는 데 성공했습니다. : courseId = {}", courseId);
        return CourseDetailResponse.of(course, schedules, questions, requests);
    }

    public CourseAllResponse getAllCourses(String oauthId) {
        log.debug("전체 수업 목록을 조회합니다.");

        Professor professor = getProfessorByOauthId(oauthId);

        List<CourseSummaryResponse> todayCourses = getTodayCoursesByOauthId(professor);
        List<CourseSummaryResponse> allCourses = getAllCoursesByOauthId(professor);

        return CourseAllResponse.of(todayCourses, allCourses);
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
        log.debug("수업을 시작 상태로 변경합니다. courseId = {}", courseId);

        Course course = findCourseByProfessor(oauthId, courseId);
        course.activate();

        log.info("수업이 시작 상태로 변경되었습니다. courseId = {}", courseId);
    }

    @Transactional
    public void closeCourse(String oauthId, long courseId) {
        log.debug("수업을 종료 상태로 변경합니다. courseId = {}", courseId);

        Course course = findCourseByProfessor(oauthId, courseId);
        course.deactivate();

        log.info("수업이 종료 상태로 변경되었습니다. courseId = {}", courseId);
    }

    private Professor getProfessorByOauthId(String oauthId) {
        return professorRepository.findByOauthId(oauthId)
                .orElseThrow(() -> new BaseException(ProfessorErrorCode.PROFESSOR_NOT_FOUND));
    }

    private Course getCourseByCourseId(long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new BaseException(CourseErrorCode.COURSE_NOT_FOUND));
    }

    private Course findCourseByProfessor(String oauthId, long courseId) {
        Professor professor = getProfessorByOauthId(oauthId);
        Course course = getCourseByCourseId(courseId);

        if (!course.getProfessor().getId().equals(professor.getId())) {
            throw new BaseException(CourseErrorCode.UNAUTHORIZED_PROFESSOR);
        }

        return course;
    }

    private List<CourseScheduleResponse> getSchedulesByCourseId(long courseId) {
        List<Schedule> schedules = scheduleRepository.findSchedulesByCourseId(courseId);

        return schedules.stream()
                .map(schedule -> new CourseScheduleResponse(
                        schedule.getDay(),
                        schedule.getStartTime().toString(),
                        schedule.getEndTime().toString()
                ))
                .collect(Collectors.toList());
    }

    private List<CourseQuestionResponse> getQuestionsByCourse(Course course) {
        List<Question> questions = course.getQuestions();

        return questions.stream()
                .map(question -> new CourseQuestionResponse(
                        question.getId(),
                        question.getCreatedAt(),
                        question.getContent()
                ))
                .collect(Collectors.toList());
    }

    private List<CourseRequestResponse> getRequestsByCourse(Course course) {
        List<Request> requests = course.getRequests();

        return requests.stream()
                .map(request -> new CourseRequestResponse(
                        request.getType(),
                        request.getCount()
                ))
                .collect(Collectors.toList());
    }

    private List<CourseSummaryResponse> getTodayCoursesByOauthId(Professor professor) {
        String todayDay = TimeUtil.getTodayDay();
        List<Course> todayCourses = courseRepository.findCoursesByDayAndProfessor(todayDay, professor);

        return todayCourses.stream()
                .map(course -> CourseSummaryResponse.of(
                        course,
                        getSchedulesByCourseId(course.getId())
                ))
                .collect(Collectors.toList());
    }

    private List<CourseSummaryResponse> getAllCoursesByOauthId(Professor professor) {
        List<Course> allCourses = courseRepository.findCoursesByProfessor(professor);

        return allCourses.stream()
                .map(course -> CourseSummaryResponse.of(
                        course,
                        getSchedulesByCourseId(course.getId())
                ))
                .collect(Collectors.toList());
    }
}
