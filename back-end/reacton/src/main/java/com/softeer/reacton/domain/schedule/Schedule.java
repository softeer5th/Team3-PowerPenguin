package com.softeer.reacton.domain.schedule;

import com.softeer.reacton.domain.course.Course;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "schedule")
@Entity
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 3)
    private String day;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Builder
    public Schedule(String day, LocalTime startTime, LocalTime endTime, Course course) {
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
        this.course = course;
    }
}