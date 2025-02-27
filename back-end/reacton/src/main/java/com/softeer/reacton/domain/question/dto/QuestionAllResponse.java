package com.softeer.reacton.domain.question.dto;

import com.softeer.reacton.domain.course.dto.CourseQuestionResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class QuestionAllResponse {
    List<CourseQuestionResponse> questions;

    public static QuestionAllResponse of(List<CourseQuestionResponse> questions) {
        return QuestionAllResponse.builder()
                .questions(questions)
                .build();
    }
}
