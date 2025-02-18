package com.softeer.reacton.domain.question.dto;

import com.softeer.reacton.domain.course.dto.CourseQuestionResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class QuestionResponse {
    List<CourseQuestionResponse> questions;

    public static QuestionResponse of(List<CourseQuestionResponse> questions) {
        return QuestionResponse.builder()
                .questions(questions)
                .build();
    }
}
