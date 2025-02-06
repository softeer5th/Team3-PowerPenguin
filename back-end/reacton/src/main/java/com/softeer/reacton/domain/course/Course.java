package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.enums.CourseType;
import com.softeer.reacton.domain.professor.Professor;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "course")
@Entity
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Column(nullable = false, unique = true, length = 10)
    private String accessCode;

    @Column(nullable = false, length = 20)
    private String status; // 상태 (진행중, 종료됨 등)

    @Column(length = 512)
    private String fileUrl; // 강의 자료 URL

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id", nullable = false)
    private Professor professor; // 교수 정보 (외래 키)

}
