package com.softeer.reacton.domain.course.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@JsonPropertyOrder({"today", "all"})
public class CourseAllResponse {
    List<CourseSummaryResponse> today;
    List<CourseSummaryResponse> all;

    public static CourseAllResponse of(List<CourseSummaryResponse> today, List<CourseSummaryResponse> all) {
        return CourseAllResponse.builder()
                .today(today)
                .all(all)
                .build();
    }
}
