package com.softeer.reacton.domain.course.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.softeer.reacton.domain.course.Course;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@JsonPropertyOrder({"name", "courseCode", "capacity", "university", "type", "accessCode", "fileUrl", "schedules", "questions", "requests"})
public class CourseDetailResponse {
    private String name;
    private String courseCode;
    private int capacity;
    private String university;
    private String type;
    private int accessCode;
    private String fileUrl;
    private List<CourseScheduleResponse> schedules;
    private List<CourseQuestionResponse> questions;
    private List<CourseRequestResponse> requests;

    public static CourseDetailResponse of(Course course, List<CourseScheduleResponse> schedules,
                                          List<CourseQuestionResponse> questions, List<CourseRequestResponse> requests) {
        return CourseDetailResponse.builder()
                .name(course.getName())
                .courseCode(course.getCourseCode())
                .capacity(course.getCapacity())
                .university(course.getUniversity())
                .type(course.getType().toString())
                .accessCode(course.getAccessCode())
                .fileUrl(course.getFileName())
                .schedules(schedules)
                .questions(questions)
                .requests(requests)
                .build();
    }
}
