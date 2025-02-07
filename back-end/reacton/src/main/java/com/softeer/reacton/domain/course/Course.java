package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.dto.CourseRequest;
import com.softeer.reacton.domain.course.enums.CourseType;
import com.softeer.reacton.domain.professor.Professor;
import com.softeer.reacton.domain.schedule.Schedule;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import com.softeer.reacton.global.util.TimeUtil;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "course")
@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String courseCode;

    @Column(nullable = false)
    private int capacity;

    @Column(nullable = false, length = 100)
    private String university;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CourseType type; // 수업 종류 (전공, 교양, 기타)

    @Column(nullable = false, unique = true)
    private int accessCode;

    @Column(nullable = false)
    private boolean isActive;

    @Column(length = 512)
    private String fileUrl; // 강의 자료 URL

    @Getter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor; // 교수 정보 (외래 키)

    @Setter
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Schedule> schedules = new ArrayList<>();

    @Builder
    private Course(String name, String courseCode, int capacity, String university, CourseType type, int accessCode, Professor professor) {
        this.name = name;
        this.courseCode = courseCode;
        this.capacity = capacity;
        this.university = university;
        this.type = type;
        this.accessCode = accessCode;
        this.isActive = false;
        this.professor = professor;
    }

    public static Course create(CourseRequest request, int accessCode, Professor professor) {
        Course course = Course.builder()
                .name(request.getName())
                .courseCode(request.getCourseCode())
                .capacity(request.getCapacity())
                .university(request.getUniversity())
                .type(request.getType())
                .accessCode(accessCode)
                .professor(professor)
                .build();

        course.schedules = createScheduleList(request, course);
        return course;
    }

    public void update(CourseRequest request) {
        this.name = request.getName();
        this.courseCode = request.getCourseCode();
        this.capacity = request.getCapacity();
        this.university = request.getUniversity();
        this.type = request.getType();

        this.schedules.clear();
        this.schedules.addAll(createScheduleList(request, this));
    }

    private static List<Schedule> createScheduleList(CourseRequest request, Course course) {
        return request.getSchedules().stream()
                .map(scheduleRequest -> Schedule.builder()
                        .day(scheduleRequest.getDay())
                        .startTime(TimeUtil.parseTime(scheduleRequest.getStartTime()))
                        .endTime(TimeUtil.parseTime(scheduleRequest.getEndTime()))
                        .course(course)
                        .build())
                .toList();
    }

    public void activate() {
        if (this.isActive) {
            log.warn("이미 시작 상태인 수업입니다. : isActive = true");
            throw new BaseException(CourseErrorCode.COURSE_ALREADY_ACTIVE);
        }
        this.isActive = true;
    }

    public void deactivate() {
        if (!this.isActive) {
            log.warn("이미 종료 상태인 수업입니다. : isActive = false");
            throw new BaseException(CourseErrorCode.COURSE_ALREADY_INACTIVE);
        }
        this.isActive = false;
    }
}

