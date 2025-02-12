package com.softeer.reacton.domain.course.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class CourseQuestionResponse {
    private Long id;
    private LocalDateTime createdAt;
    private String content;
}
