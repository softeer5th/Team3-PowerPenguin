package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.course.Course;
import com.softeer.reacton.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "question")
@Entity
public class Question extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 36)
    private String studentId;

    @Column(nullable = false, length = 600)
    private String content;

    @Setter
    @Column(nullable = false)
    private Boolean isComplete;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course; // 수업 정보 (외래 키)

    @Builder
    public Question(String studentId, String content, Course course) {
        this.studentId = studentId;
        this.content = content;
        this.isComplete = false;
        this.course = course;
    }
}
