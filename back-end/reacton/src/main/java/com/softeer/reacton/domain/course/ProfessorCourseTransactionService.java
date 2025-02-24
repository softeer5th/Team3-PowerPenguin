package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.question.QuestionRepository;
import com.softeer.reacton.domain.request.Request;
import com.softeer.reacton.domain.request.RequestRepository;
import com.softeer.reacton.domain.schedule.Schedule;
import com.softeer.reacton.domain.schedule.ScheduleRepository;
import com.softeer.reacton.global.sse.SseMessageSender;
import com.softeer.reacton.global.sse.dto.SseMessage;
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
    private final SseMessageSender sseMessageSender;

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
    public void activateCourse(Course course) {
        questionRepository.deleteAllByCourse(course);
        requestRepository.resetCountByCourse(course);

        course.activate();
        courseRepository.save(course);
    }

    @Transactional
    public void closeCourse(Course course) {
        long courseId = course.getId();
        log.debug("수업을 종료 상태로 변경합니다. courseId = {}", courseId);

        course.deactivate();

        questionRepository.deleteCompleteByCourse(course);

        log.debug("SSE 서버에 수업 종료 메시지 전송을 요청합니다.");
        SseMessage<Void> sseMessage = new SseMessage<>("COURSE_CLOSED", null);
        sseMessageSender.sendMessageToAll(String.valueOf(courseId), sseMessage);

        log.info("수업이 종료 상태로 변경되었습니다. courseId = {}", courseId);
    }
}
