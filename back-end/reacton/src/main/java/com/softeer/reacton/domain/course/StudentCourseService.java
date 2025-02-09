package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.dto.CourseScheduleResponse;
import com.softeer.reacton.domain.course.dto.CourseSummaryResponse;
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

    public CourseSummaryResponse getCourseByAccessCode(int accessCode) {
        log.debug("입장코드와 일치하는 수업 정보를 조회합니다. : accessCode = {}", accessCode);

        Optional<Course> existingCourse = courseRepository.findByAccessCode(accessCode);

        Course course = existingCourse.orElseThrow(() -> {
            log.debug("수업 정보를 가져오는 과정에서 발생한 에러입니다. : Course does not exist.");
            return new BaseException(CourseErrorCode.COURSE_NOT_FOUND);
        });

        if (!course.isActive()) {
            log.debug("수업 정보를 가져오는 과정에서 발생한 에러입니다. : Course is not active.");
            throw new BaseException(CourseErrorCode.COURSE_NOT_OPENED);
        }

        List<CourseScheduleResponse> schedules = course.getSchedules().stream()
                .map(schedule -> new CourseScheduleResponse(
                        schedule.getDay(),
                        schedule.getStartTime().toString(),
                        schedule.getEndTime().toString()
                ))
                .toList();

        return new CourseSummaryResponse(
                course.getName(),
                course.getCourseCode(),
                course.getCapacity(),
                course.getUniversity(),
                course.getType().toString(),
                schedules
        );
    }
}
