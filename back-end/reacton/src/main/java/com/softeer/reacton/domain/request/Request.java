package com.softeer.reacton.domain.request;

import com.softeer.reacton.domain.course.Course;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "request")
@Entity
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private int count;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Builder
    public Request(String type, Course course) {
        this.type = type;
        this.count = 0;
        this.course = course;
    }

    public static Request create(String type, Course course) {
        return Request.builder()
                .type(type)
                .course(course).build();
    }
}
