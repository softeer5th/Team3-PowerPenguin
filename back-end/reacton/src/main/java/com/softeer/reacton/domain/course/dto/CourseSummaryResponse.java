package com.softeer.reacton.domain.course.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.softeer.reacton.domain.course.Course;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@JsonPropertyOrder({"id", "name", "courseCode", "capacity", "university", "type", "accessCode", "schedules"})
public class CourseSummaryResponse {
    private Long id;
    private String name;
    private String courseCode;
    private int capacity;
    private String university;
    private String type;
    private int accessCode;
    private List<CourseScheduleResponse> schedules;

    public static CourseSummaryResponse of(Course course, List<CourseScheduleResponse> schedules) {
        return CourseSummaryResponse.builder()
                .id(course.getId())
                .name(course.getName())
                .courseCode(course.getCourseCode())
                .capacity(course.getCapacity())
                .university(course.getUniversity())
                .type(course.getType().toString())
                .accessCode(course.getAccessCode())
                .schedules(schedules)
                .build();
    }
}
