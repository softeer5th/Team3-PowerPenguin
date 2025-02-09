package com.softeer.reacton.domain.course.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonPropertyOrder({"day", "startTime", "endTime"})
public class CourseScheduleResponse {
    private String day;
    private String startTime;
    private String endTime;
}
