package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.question.QuestionRepository;
import com.softeer.reacton.domain.request.Request;
import com.softeer.reacton.domain.request.RequestRepository;
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
    private final RequestRepository requestRepository;
    private final QuestionRepository questionRepository;

    @Transactional
    public long saveCourse(Course course) {
        courseRepository.save(course);

        for (Schedule schedule : course.getSchedules()) {
            schedule.setCourse(course);
            scheduleRepository.save(schedule);
        }

        for (Request request : course.getRequests()) {
            request.setCourse(course);
            requestRepository.save(request);
        }

        return course.getId();
    }

    @Transactional
    public void activateCourse(Course course, boolean wasActive) {
        if (!wasActive) {
            questionRepository.deleteAllByCourse(course);
            requestRepository.resetCountByCourse(course);
        }
        course.activate();
        courseRepository.save(course);
    }
}
