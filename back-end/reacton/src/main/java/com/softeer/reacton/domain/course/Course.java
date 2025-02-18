package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.dto.CourseRequest;
import com.softeer.reacton.domain.course.enums.CourseType;
import com.softeer.reacton.domain.professor.Professor;
import com.softeer.reacton.domain.question.Question;
import com.softeer.reacton.domain.request.Request;
import com.softeer.reacton.domain.schedule.Schedule;
import com.softeer.reacton.global.entity.BaseEntity;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.CourseErrorCode;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "course")
@Entity
public class Course extends BaseEntity {

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

    @Setter
    @Column(nullable = false, unique = true)
    private int accessCode;

    @Getter
    @Column(nullable = false)
    private boolean isActive;

    @Setter
    @Column
    private String fileName;

    @Setter
    @Column(length = 512, name="file_s3_key")
    private String fileS3Key;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor; // 교수 정보 (외래 키)

    @Setter
    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    private List<Schedule> schedules = new ArrayList<>();

    @Setter
    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    @OrderBy("createdAt ASC")
    private List<Question> questions = new ArrayList<>();

    @Setter
    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY)
    @OrderBy("count DESC")
    private List<Request> requests = new ArrayList<>();

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

    public static Course create(CourseRequest request, Professor professor) {
        return Course.builder()
                .name(request.getName())
                .courseCode(request.getCourseCode())
                .capacity(request.getCapacity())
                .university(request.getUniversity())
                .type(request.getType())
                .professor(professor)
                .build();
    }

    public void update(CourseRequest request) {
        this.name = request.getName();
        this.courseCode = request.getCourseCode();
        this.capacity = request.getCapacity();
        this.university = request.getUniversity();
        this.type = request.getType();
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

