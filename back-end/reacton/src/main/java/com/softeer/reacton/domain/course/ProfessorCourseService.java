package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.dto.*;
import com.softeer.reacton.domain.professor.Professor;
import com.softeer.reacton.domain.professor.ProfessorRepository;
import com.softeer.reacton.domain.question.Question;
import com.softeer.reacton.domain.question.QuestionRepository;
import com.softeer.reacton.domain.request.Request;
import com.softeer.reacton.domain.request.RequestRepository;
import com.softeer.reacton.domain.schedule.Schedule;
import com.softeer.reacton.domain.schedule.ScheduleRepository;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import com.softeer.reacton.global.exception.code.FileErrorCode;
import com.softeer.reacton.global.exception.code.ProfessorErrorCode;
import com.softeer.reacton.global.s3.S3Service;
import com.softeer.reacton.global.util.TimeUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfessorCourseService {
    private final ProfessorRepository professorRepository;
    private final CourseRepository courseRepository;
    private final ScheduleRepository scheduleRepository;
    private final QuestionRepository questionRepository;
    private final RequestRepository requestRepository;
    private final ProfessorCourseTransactionService professorCourseTransactionService;
    private final S3Service s3Service;

    private static final int MAX_RETRIES = 10;
    private static final String FILE_DIRECTORY = "course-files/";
    private static final long MAX_FILE_SIZE = 100L * 1024 * 1024;
    private final SecureRandom secureRandom = new SecureRandom();

    public Map<String, String> getActiveCourseByUser(String oauthId) {
        log.debug("활성화된 수업을 조회합니다.");
        Professor professor = professorRepository.findByOauthId(oauthId)
                .orElseThrow(() -> new BaseException(ProfessorErrorCode.PROFESSOR_NOT_FOUND));

        return courseRepository.findByProfessorAndIsActiveTrue(professor)
                .map(course -> Map.of("courseId", course.getId().toString()))
                .orElse(Collections.emptyMap());
    }

    public long createCourse(String oauthId, CourseRequest request) {
        log.debug("수업을 생성합니다.");
        if (request == null) {
            log.warn("수업 생성 요청 데이터가 null입니다. : 'request' is null.");
            throw new BaseException(CourseErrorCode.COURSE_REQUEST_IS_NULL);
        }

        Professor professor = professorRepository.findByOauthId(oauthId)
                .orElseThrow(() -> new BaseException(ProfessorErrorCode.PROFESSOR_NOT_FOUND));

        Course course = Course.create(request, professor);
        List<Schedule> schedules = createSchedules(request, course);
        course.setSchedules(schedules);

        return generateAccessCodeAndSave(course);
    }

    public CourseDetailResponse getCourseDetail(long courseId, String oauthId) {
        log.debug("수업 상세 정보를 조회합니다.");

        Course course = getCourseByProfessor(oauthId, courseId);

        List<CourseScheduleResponse> schedules = getSchedulesByCourseInOrder(course);
        List<CourseQuestionResponse> questions = getQuestionsByCourseInOrder(course);
        List<CourseRequestResponse> requests = getRequestsByCourseInOrder(course);

        log.debug("수업 상세 정보를 가져오는 데 성공했습니다. : courseId = {}", courseId);
        return CourseDetailResponse.of(course, schedules, questions, requests);
    }

    public CourseAllResponse getAllCourses(String oauthId) {
        log.debug("전체 수업 목록을 조회합니다.");

        Professor professor = getProfessorByOauthId(oauthId);
        List<Course> allCourses = courseRepository.findCoursesWithSchedulesByProfessor(professor);
        List<CourseSummaryResponse> todayCoursesResponse = getTodayCoursesResponse(allCourses);
        List<CourseSummaryResponse> allCoursesResponse = getAllCoursesResponse(allCourses);

        return CourseAllResponse.of(todayCoursesResponse, allCoursesResponse);
    }

    @Transactional
    public void updateCourse(String oauthId, long courseId, CourseRequest request) {
        log.debug("수업 데이터를 업데이트합니다. : courseId = {}", courseId);

        if (request == null) {
            log.warn("수업 수정 요청 데이터가 null입니다. : 'request' is null.");
            throw new BaseException(CourseErrorCode.COURSE_REQUEST_IS_NULL);
        }

        Course course = getCourseByProfessor(oauthId, courseId);
        course.update(request);

        List<CourseRequest.ScheduleRequest> scheduleRequests = request.getSchedules();
        scheduleRepository.deleteAllByCourse(course);
        course.getSchedules().clear(); // 영속성 컨텍스트에서도 제거

        List<Schedule> newSchedules = scheduleRequests.stream()
                .map(scheduleRequest -> Schedule.create(scheduleRequest, course))
                .collect(Collectors.toList());
        scheduleRepository.saveAll(newSchedules);
        course.setSchedules(newSchedules);

        log.info("수업 업데이트가 완료되었습니다. : courseId = {}", courseId);
    }

    @Transactional
    public void deleteCourse(String oauthId, long courseId) {
        log.debug("수업을 삭제합니다. : courseId = {}", courseId);

        Course course = getCourseByProfessor(oauthId, courseId);

        scheduleRepository.deleteAllByCourse(course);
        questionRepository.deleteAllByCourse(course);
        requestRepository.deleteAllByCourse(course);
        courseRepository.delete(course);

        log.info("수업이 삭제되었습니다. : courseId = {}", courseId);
    }

    @Transactional
    public void startCourse(String oauthId, long courseId) {
        log.debug("수업을 시작 상태로 변경합니다. courseId = {}", courseId);

        Course course = getCourseByProfessor(oauthId, courseId);
        course.activate();

        log.info("수업이 시작 상태로 변경되었습니다. courseId = {}", courseId);
    }

    @Transactional
    public void closeCourse(String oauthId, long courseId) {
        log.debug("수업을 종료 상태로 변경합니다. courseId = {}", courseId);

        Course course = getCourseByProfessor(oauthId, courseId);
        course.deactivate();

        log.info("수업이 종료 상태로 변경되었습니다. courseId = {}", courseId);
    }

    @Transactional
    public Map<String, String> uploadFile(String oauthId, long courseId, MultipartFile file) {
        Course course = getCourseByProfessor(oauthId, courseId);

        String filename = null;
        String s3Key;

        if (!file.isEmpty() && validateFile(file)) {
            filename = file.getOriginalFilename();

            s3Key = s3Service.uploadFile(file, FILE_DIRECTORY);

            if (isFileExists(course)) {
                s3Service.deleteFile(course.getFileS3Key());
                log.debug("기존 강의자료 파일 삭제 완료: {}", course.getFileName());
            }

            course.setFileName(filename);
            course.setFileS3Key(s3Key);
            courseRepository.save(course);
        }

        return Map.of("filename", filename != null ? filename : "");
    }

    public Map<String, String> getCourseFileUrl(String oauthId, long courseId) {
        Course course = getCourseByProfessor(oauthId, courseId);
        if (isFileExists(course)) {
            String s3Url = s3Service.generatePresignedUrl(course.getFileS3Key(), 1).toString();
            return Map.of("fileUrl", s3Url);
        }
        return Map.of("fileUrl", "");
    }

    private Professor getProfessorByOauthId(String oauthId) {
        return professorRepository.findByOauthId(oauthId)
                .orElseThrow(() -> new BaseException(ProfessorErrorCode.PROFESSOR_NOT_FOUND));
    }

    private Course getCourseByCourseId(long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new BaseException(CourseErrorCode.COURSE_NOT_FOUND));
    }

    private Course getCourseByProfessor(String oauthId, long courseId) {
        Professor professor = getProfessorByOauthId(oauthId);
        Course course = getCourseByCourseId(courseId);

        if (!course.getProfessor().getId().equals(professor.getId())) {
            throw new BaseException(CourseErrorCode.UNAUTHORIZED_PROFESSOR);
        }

        return course;
    }

    private List<CourseScheduleResponse> getSchedulesByCourse(Course course) {
        return course.getSchedules().stream()
                .map(schedule -> new CourseScheduleResponse(
                        schedule.getDay(),
                        schedule.getStartTime().toString(),
                        schedule.getEndTime().toString()))
                .collect(Collectors.toList());
    }

    private List<CourseScheduleResponse> getSchedulesByCourseInOrder(Course course) {
        List<Schedule> schedules = scheduleRepository.findSchedulesByCourse(course);

        return schedules.stream()
                .map(schedule -> new CourseScheduleResponse(
                        schedule.getDay(),
                        schedule.getStartTime().toString(),
                        schedule.getEndTime().toString()))
                .collect(Collectors.toList());
    }

    private List<CourseQuestionResponse> getQuestionsByCourseInOrder(Course course) {
        List<Question> questions = course.getQuestions();

        return questions.stream()
                .map(question -> new CourseQuestionResponse(
                        question.getId(),
                        question.getCreatedAt(),
                        question.getContent()
                ))
                .collect(Collectors.toList());
    }

    private List<CourseRequestResponse> getRequestsByCourseInOrder(Course course) {
        List<Request> requests = course.getRequests();

        return requests.stream()
                .map(request -> new CourseRequestResponse(
                        request.getType(),
                        request.getCount()
                ))
                .collect(Collectors.toList());
    }

    private List<CourseSummaryResponse> getTodayCoursesResponse(List<Course> allCourses) {
        String currentDay = TimeUtil.getCurrentDay();

        return allCourses.stream()
                .filter(course -> hasScheduleInDay(course, currentDay))
                .sorted(Comparator
                        .comparing(course -> getEarliestStartTime(course, currentDay)))
                .map(course -> CourseSummaryResponse.of(course, getSchedulesForToday(course, currentDay)))
                .collect(Collectors.toList());
    }

    private List<CourseSummaryResponse> getAllCoursesResponse(List<Course> allCourses) {
        return allCourses.stream()
                .map(course -> CourseSummaryResponse.of(course, getSchedulesByCourse(course)))
                .collect(Collectors.toList());
    }

    private boolean hasScheduleInDay(Course course, String day) {
        return course.getSchedules().stream()
                .anyMatch(schedule -> schedule.getDay().equals(day));
    }

    private LocalTime getEarliestStartTime(Course course, String day) {
        return course.getSchedules().stream()
                .filter(schedule -> schedule.getDay().equals(day))
                .map(Schedule::getStartTime)
                .min(Comparator.naturalOrder())
                .orElse(LocalTime.MAX);
    }

    private List<CourseScheduleResponse> getSchedulesForToday(Course course, String currentDay) {
        return course.getSchedules().stream()
                .filter(schedule -> schedule.getDay().equals(currentDay))
                .map(schedule -> new CourseScheduleResponse(
                        schedule.getDay(),
                        schedule.getStartTime().toString(),
                        schedule.getEndTime().toString()))
                .collect(Collectors.toList());
    }

    private List<Schedule> createSchedules(CourseRequest request, Course course) {
        List<Schedule> schedules = new ArrayList<>();
        for (CourseRequest.ScheduleRequest scheduleRequest : request.getSchedules()) {
            Schedule schedule = Schedule.create(scheduleRequest, course);
            schedules.add(schedule);
        }
        return schedules;
    }

    private long generateAccessCodeAndSave(Course course) {
        for (int i = 0; i < MAX_RETRIES; i++) {
            int accessCode = generateUniqueAccessCode();
            log.debug("입장 코드 생성 시도 {}회 - {}", i + 1, accessCode);

            course.setAccessCode(accessCode);

            try {
                return professorCourseTransactionService.saveCourse(course);
            } catch (DataIntegrityViolationException e) {
                log.warn("입장 코드 중복으로 인해 저장 실패 - 재시도 {}회: {}", i + 1, accessCode);
            }
        }

        log.error("최대 시도 횟수({}) 초과로 인해 입장 코드 생성 실패", MAX_RETRIES);
        throw new BaseException(CourseErrorCode.ACCESS_CODE_GENERATION_FAILED);
    }

    private int generateUniqueAccessCode() {
        return 100000 + secureRandom.nextInt(1000000); // 100000~999999
    }

    private boolean validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            return false;
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BaseException(FileErrorCode.FILE_SIZE_EXCEEDED);
        }

        String fileName = file.getOriginalFilename();
        if (fileName == null || !fileName.toLowerCase().endsWith(".pdf")) {
            throw new BaseException(FileErrorCode.INVALID_FILE_TYPE);
        }

        try {
            String mimeType = file.getContentType();
            if (mimeType == null || !mimeType.equals("application/pdf")) {
                throw new BaseException(FileErrorCode.INVALID_FILE_TYPE);
            }
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    private boolean isFileExists(Course course) {
        return course.getFileName() != null && !course.getFileName().isEmpty() && course.getFileS3Key() != null && !course.getFileS3Key().isEmpty();
    }

}