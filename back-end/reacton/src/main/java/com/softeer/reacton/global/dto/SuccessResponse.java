package com.softeer.reacton.global.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.softeer.reacton.domain.course.dto.*;
import com.softeer.reacton.domain.question.dto.QuestionAllResponse;
import com.softeer.reacton.domain.professor.dto.ProfessorInfoResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@JsonPropertyOrder({"success", "message", "data"})
public class SuccessResponse<T> {
    private final boolean success;
    private final String message;
    private final T data;

    @Builder
    public SuccessResponse(String message, T data) {
        this.success = true;
        this.message = message;
        this.data = data;
    }

    public static SuccessResponse<Map<String, String>> of(String message, Map<String, String> data) {
        return SuccessResponse.<Map<String, String>>builder()
                .message(message)
                .data(data)
                .build();
    }

    public static SuccessResponse<CourseDetailResponse> of(String message, CourseDetailResponse data) {
        return SuccessResponse.<CourseDetailResponse>builder()
                .message(message)
                .data(data)
                .build();
    }

    public static SuccessResponse<CourseSummaryResponse> of(String message, CourseSummaryResponse data) {
        return SuccessResponse.<CourseSummaryResponse>builder()
                .message(message)
                .data(data)
                .build();
    }

    public static SuccessResponse<List<CourseSummaryResponse>> of(String message, List<CourseSummaryResponse> data) {
        return SuccessResponse.<List<CourseSummaryResponse>>builder()
                .message(message)
                .data(data)
                .build();
    }

    public static SuccessResponse<CourseQuestionResponse> of(String message, CourseQuestionResponse data) {
        return SuccessResponse.<CourseQuestionResponse>builder()
                .message(message)
                .data(data)
                .build();
    }

    public static SuccessResponse<CourseAllResponse> of(String message, CourseAllResponse data) {
        return SuccessResponse.<CourseAllResponse>builder()
                .message(message)
                .data(data)
                .build();
    }

    public static SuccessResponse<QuestionAllResponse> of(String message, QuestionAllResponse data) {
        return SuccessResponse.<QuestionAllResponse>builder()
                .message(message)
                .data(data)
                .build();
    }

    public static SuccessResponse<ProfessorInfoResponse> of(String message, ProfessorInfoResponse data) {
        return SuccessResponse.<ProfessorInfoResponse>builder()
                .message(message)
                .data(data)
                .build();
    }

    public static SuccessResponse<ActiveCourseResponse> of(String message, ActiveCourseResponse data) {
        return SuccessResponse.<ActiveCourseResponse>builder()
                .message(message)
                .data(data)
                .build();
    }

}