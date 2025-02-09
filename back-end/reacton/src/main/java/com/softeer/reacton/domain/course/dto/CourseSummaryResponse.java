package com.softeer.reacton.domain.course.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@JsonPropertyOrder({"name", "courseCode", "capacity", "university", "type", "schedules"})
public class CourseSummaryResponse {
    private String name;
    private String courseCode;
    private int capacity;
    private String university;
    private String type;
    private List<CourseScheduleResponse> schedules;
}
