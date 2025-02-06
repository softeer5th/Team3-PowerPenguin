package com.softeer.reacton.domain.course.dto;

import com.softeer.reacton.domain.course.enums.CourseType;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class CourseCreateRequest {
    private String name;
    private String courseCode;
    private int capacity;
    private String university;
    private CourseType type;
    private List<ScheduleRequest> schedules;

    @Getter
    @NoArgsConstructor
    public static class ScheduleRequest {
        private String day;
        private String startTime;
        private String endTime;
    }
}