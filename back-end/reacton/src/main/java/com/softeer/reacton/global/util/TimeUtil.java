package com.softeer.reacton.global.util;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.TimeUtilErrorCode;
import lombok.extern.slf4j.Slf4j;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Map;

@Slf4j
public class TimeUtil {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final Map<DayOfWeek, String> DAYMAPPER = Map.of(
            DayOfWeek.MONDAY, "월",
            DayOfWeek.TUESDAY, "화",
            DayOfWeek.WEDNESDAY, "수",
            DayOfWeek.THURSDAY, "목",
            DayOfWeek.FRIDAY, "금",
            DayOfWeek.SATURDAY, "토",
            DayOfWeek.SUNDAY, "일"
    );

    public static LocalTime parseTime(String time) {
        if (time == null || time.isBlank()) {
            log.debug("문자열을 LocalTime으로 변환하는 과정에서 오류가 발생했습니다. : 'time' is null or empty.");
            throw new BaseException(TimeUtilErrorCode.NULL_TIME_STRING);
        }
        try {
            return LocalTime.parse(time, FORMATTER);
        } catch (DateTimeParseException e) {
            log.debug("문자열을 LocalTime으로 변환하는 과정에서 오류가 발생했습니다. : Failed to parse time. time={}", time);
            throw new BaseException(TimeUtilErrorCode.INVALID_TIME_FORMAT);
        }
    }

    public static String formatTime(LocalTime time) {
        if (time == null) {
            log.debug("LocalTime을 문자열로 바꾸는 과정에서 발생한 에러입니다. : 'time' is null.");
            throw new BaseException(TimeUtilErrorCode.NULL_LOCAL_TIME);
        }
        return time.format(FORMATTER);
    }

    public static boolean isEndTimeAfterStartTime(String startTime, String endTime) {
        LocalTime start = parseTime(startTime);
        LocalTime end = parseTime(endTime);
        return end.isAfter(start);
    }

    public static String getCurrentDay() {
        DayOfWeek dayOfWeek = LocalDate.now().getDayOfWeek();
        return DAYMAPPER.get(dayOfWeek);
    }
}