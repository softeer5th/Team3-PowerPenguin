package com.softeer.reacton.domain.course.enums;

import lombok.Getter;

@Getter
public enum CourseType {
    MAJOR("전공"),
    GENERAL("교양"),
    OTHER("기타");

    private final String description;

    CourseType(String description) {
        this.description = description;
    }
}