package com.softeer.reacton.domain.course.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonPropertyOrder({"type", "count"})
public class CourseRequestResponse {
    private String type;
    private int count;
}
