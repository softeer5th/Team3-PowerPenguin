package com.softeer.reacton;

import com.softeer.reacton.entity.Course;
import com.softeer.reacton.entity.Professor;
import com.softeer.reacton.entity.Schedule;
import com.softeer.reacton.repository.CourseRepository;
import com.softeer.reacton.repository.ProfessorRepository;
import com.softeer.reacton.repository.ScheduleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceTestService {

    private final CourseRepository courseRepository;

    private final ScheduleRepository scheduleRepository;
    private final ProfessorRepository professorRepository;

    @Transactional
    public void testInsertPerformance() {
        Long startTime, endTime;
        Professor professor = professorRepository.findById(1L).orElseThrow();

        // 🟢 강의 추가
        startTime = System.currentTimeMillis();
        Course course = new Course();
        course.setName("인공지능 개론");
        course.setCode("AI101");
        course.setCapacity(100);
        course.setUniversity("Softeer University");
        course.setClassType("온라인");
        course.setSchedule("Monday 13:00-14:30, Wednesday 15:00-16:30, Friday 10:00-11:30");  // String 방식 대신 Schedule 테이블 사용
        course.setAccessCode(123456);
        course.setStatus("ACTIVE");
        course.setFileUrl(null);
        course.setProfessor(professor);
        course = courseRepository.save(course); // 강의 저장 후 ID 생성

        endTime = System.currentTimeMillis();
        System.out.println("String 방식 저장 소요 시간: " + (endTime - startTime) + "ms");

        startTime = System.currentTimeMillis();
        Course course2 = new Course();
        course2.setName("인공지능 개론2");
        course2.setCode("AI1012");
        course2.setCapacity(102);
        course2.setUniversity("Softeer University2");
        course2.setClassType("온라인2");
        course2.setSchedule("");
        course2.setAccessCode(123454);
        course2.setStatus("ACTIVE");
        course2.setFileUrl(null);
        course2.setProfessor(professor);
        courseRepository.save(course2);

        List<Schedule> newSchedules = List.of(
                new Schedule(null, "Monday 13:00-14:30", course),
                new Schedule(null, "Wednesday 15:00-16:30", course),
                new Schedule(null, "Friday 10:00-11:30", course)
        );
        scheduleRepository.saveAll(newSchedules);

        endTime = System.currentTimeMillis();
        System.out.println("테이블 방식 저장 소요 시간: " + (endTime - startTime) + "ms");
    }

    @Transactional
    public void testModifyCourseSchedulePerformance(Long courseId1, Long courseId2) {
        long startTime, endTime;

        // String 방식 데이터 추가
        startTime = System.currentTimeMillis();
        Course course = courseRepository.findById(courseId1).orElseThrow();

        course.setName("인공지능 개론");
        course.setCode("AI101");
        course.setCapacity(100);
        course.setUniversity("Softeer University");
        course.setClassType("온라인");
        course.setSchedule("Monday 13:00-14:30, Wednesday 15:00-16:30, Friday 10:00-11:30");
        course.setAccessCode(123456);
        course.setStatus("ACTIVE");
        course.setFileUrl(null);
        courseRepository.save(course);

        endTime = System.currentTimeMillis();
        System.out.println("String 방식 저장 소요 시간: " + (endTime - startTime) + "ms");


        // 테이블 방식 데이터 추가
        startTime = System.currentTimeMillis();
        course = courseRepository.findById(courseId2).orElseThrow();
        course.setName("인공지능 개론");
        course.setCode("AI101");
        course.setCapacity(100);
        course.setUniversity("Softeer University");
        course.setClassType("온라인");
        course.setAccessCode(123456);
        course.setStatus("ACTIVE");
        course.setFileUrl(null);
        scheduleRepository.deleteByCourseId(courseId2);

        // 새로운 일정 추가
        List<Schedule> newSchedules = List.of(
                new Schedule(null, "Monday 13:00-14:30", course),
                new Schedule(null, "Wednesday 15:00-16:30", course),
                new Schedule(null, "Friday 10:00-11:30", course)
        );
        scheduleRepository.saveAll(newSchedules);
        endTime = System.currentTimeMillis();
        System.out.println("테이블 방식 저장 소요 시간: " + (endTime - startTime) + "ms");

    }

    @Transactional
    public void testQueryPerformance(Long courseId1, Long courseId2) {
        long startTime, endTime;

        // String 방식 조회 및 파싱
        startTime = System.currentTimeMillis();

        Course course = courseRepository.findById(courseId1).orElseThrow();
        String scheduleString = course.getSchedule();
        String[] parsedSchedules = scheduleString.split(", ");

        endTime = System.currentTimeMillis();
        System.out.println("String 방식 조회 및 파싱 소요 시간: " + (endTime - startTime) + "ms");


        // 테이블 방식 조회
        startTime = System.currentTimeMillis();
        Course courseOptional = courseRepository.findCourseWithSchedules(courseId2);
        List<Schedule> schedules = courseOptional.getSchedules();

        endTime = System.currentTimeMillis();
        System.out.println("테이블 방식 조회 소요 시간: " + (endTime - startTime) + "ms");
    }

}
