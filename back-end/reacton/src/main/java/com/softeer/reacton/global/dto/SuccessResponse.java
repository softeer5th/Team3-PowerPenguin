package com.softeer.reacton.global.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.softeer.reacton.domain.course.dto.CourseAllResponse;
import com.softeer.reacton.domain.course.dto.CourseDetailResponse;
import com.softeer.reacton.domain.course.dto.CourseSummaryResponse;
import lombok.Builder;
import lombok.Getter;

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
  
    public static SuccessResponse<CourseAllResponse> of(String message, CourseAllResponse data) {
        return SuccessResponse.<CourseAllResponse>builder()
                .message(message)
                .data(data)
                .build();
    }
}