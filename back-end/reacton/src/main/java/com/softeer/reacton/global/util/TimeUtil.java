package com.softeer.reacton.global.util;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class TimeUtil {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public static LocalTime parseTime(String time) {
        return LocalTime.parse(time, FORMATTER);
    }

    public static String formatTime(LocalTime time) {
        return time.format(FORMATTER);
    }
}