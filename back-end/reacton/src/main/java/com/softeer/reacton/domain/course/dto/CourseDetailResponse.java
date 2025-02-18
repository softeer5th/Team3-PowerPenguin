package com.softeer.reacton.domain.course.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.softeer.reacton.domain.course.Course;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@JsonPropertyOrder({"id", "name", "courseCode", "capacity", "university", "type", "accessCode", "fileName", "schedules", "questions", "requests"})
public class CourseDetailResponse {
    private Long id;
    private String name;
    private String courseCode;
    private int capacity;
    private String university;
    private String type;
    private int accessCode;
    private String fileName;
    private List<CourseScheduleResponse> schedules;
    private List<CourseQuestionResponse> questions;
    private List<CourseRequestResponse> requests;

    public static CourseDetailResponse of(Course course, List<CourseScheduleResponse> schedules,
                                          List<CourseQuestionResponse> questions, List<CourseRequestResponse> requests) {
        return CourseDetailResponse.builder()
                .id(course.getId())
                .name(course.getName())
                .courseCode(course.getCourseCode())
                .capacity(course.getCapacity())
                .university(course.getUniversity())
                .type(course.getType().toString())
                .accessCode(course.getAccessCode())
                .fileName(course.getFileName() != null && !course.getFileName().isEmpty() ? course.getFileName() : "")
                .schedules(schedules)
                .questions(questions)
                .requests(requests)
                .build();
    }
}
