package com.softeer.reacton.domain.course.dto;

import com.softeer.reacton.domain.course.enums.CourseType;
import com.softeer.reacton.global.util.TimeUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class CourseRequest {
    @NotBlank(message = "수업 이름이 입력되지 않았습니다.")
    @Size(max = 35, message = "수업 이름은 35자 이내여야 합니다.")
    private String name;

    @NotBlank(message = "학수번호가 입력되지 않았습니다.")
    @Size(max = 10, message = "학수 번호는 10자 이내여야 합니다.")
    private String courseCode;

    @Positive(message = "수업 정원이 입력되지 않았습니다.")
    @Min(value = 1, message = "수업 정원은 1명 이상이어야 합니다.")
    @Max(value = 1000, message = "수업 정원은 1000명 이하여야 합니다.")
    private int capacity;

    @NotBlank(message = "대학 이름이 입력되지 않았습니다.")
    @Size(max = 20, message = "대학 이름은 20자 이내여야 합니다.")
    private String university;

    @NotNull(message = "수업 종류가 선택되지 않았습니다.")
    private CourseType type;

    @Valid
    private List<ScheduleRequest> schedules;

    @Getter
    @NoArgsConstructor
    public static class ScheduleRequest {
        @NotBlank(message = "요일이 필요합니다.")
        @Pattern(regexp = "^(월|화|수|목|금|토|일)$", message = "요일 값이 올바르지 않습니다. (월~일)")
        private String day;

        @NotBlank(message = "시작 시간이 필요합니다.")
        @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "시간 형식이 올바르지 않습니다. (HH:mm)")
        private String startTime;

        @NotBlank(message = "종료 시간이 필요합니다.")
        @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "시간 형식이 올바르지 않습니다. (HH:mm)")
        private String endTime;

        @AssertTrue(message = "종료 시간은 시작 시간보다 늦어야 합니다.")
        public boolean isEndTimeValid() {
            return TimeUtil.isEndTimeAfterStartTime(startTime, endTime);
        }
    }
}