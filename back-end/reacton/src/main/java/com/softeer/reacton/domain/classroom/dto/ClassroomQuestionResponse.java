package com.softeer.reacton.domain.classroom.dto;

import com.softeer.reacton.domain.course.dto.CourseQuestionResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ClassroomQuestionResponse {
    List<CourseQuestionResponse> questions;

    public static ClassroomQuestionResponse of(List<CourseQuestionResponse> questions) {
        return ClassroomQuestionResponse.builder()
                .questions(questions)
                .build();
    }
}
