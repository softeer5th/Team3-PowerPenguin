package com.softeer.reacton.domain.course;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Log4j2
@Service
@RequiredArgsConstructor
public class StudentCourseService {

    private final CourseRepository courseRepository;

    public Map<String, Object> getCourseByAccessCode(int accessCode) {
        log.debug("입장코드와 일치하는 수업 정보를 조회합니다. : accessCode = {}", accessCode);

        Map<String, Object> courseInfo = new HashMap<>();

        Optional<Course> existingCourse = courseRepository.findByAccessCode(accessCode);

        Course course = existingCourse.orElseThrow(() -> {
            log.debug("수업 정보를 가져오는 과정에서 발생한 에러입니다. : Course does not exist.");
            throw new BaseException(CourseErrorCode.COURSE_NOT_FOUND);
        });

        if (!course.isActive()) {
            log.debug("수업 정보를 가져오는 과정에서 발생한 에러입니다. : Course is not active.");
            throw new BaseException(CourseErrorCode.COURSE_NOT_OPENED);
        }

        courseInfo.put("name", course.getName());
        courseInfo.put("courseCode", course.getCourseCode());
        courseInfo.put("capacity", course.getCapacity());
        courseInfo.put("university", course.getUniversity());
        courseInfo.put("type", course.getType());
        List<Map<String, String>> schedules = course.getSchedules().stream()
                .map(schedule -> Map.of(
                        "day", schedule.getDay(),
                        "startTime", schedule.getStartTime().toString(),
                        "endTime", schedule.getEndTime().toString()))
                .toList();
        courseInfo.put("schedules", schedules);

        return courseInfo;
    }
}
