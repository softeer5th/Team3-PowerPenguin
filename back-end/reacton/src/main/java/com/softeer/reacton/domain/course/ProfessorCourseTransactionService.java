package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.schedule.Schedule;
import com.softeer.reacton.domain.schedule.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfessorCourseTransactionService {

    private final CourseRepository courseRepository;
    private final ScheduleRepository scheduleRepository;

    @Transactional
    public long saveCourse(Course course) {
        courseRepository.save(course);

        for (Schedule schedule : course.getSchedules()) {
            schedule.setCourse(course);
            scheduleRepository.save(schedule);
        }

        return course.getId();
    }
}
