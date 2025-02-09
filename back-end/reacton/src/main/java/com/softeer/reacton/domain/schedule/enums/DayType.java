package com.softeer.reacton.domain.schedule.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DayType {
    월(1), 화(2), 수(3), 목(4), 금(5), 토(6), 일(7);

    private final int order;

    public static int getDayOrder(String day) {
        for (DayType d : values()) {
            if (d.name().equals(day)) {
                return d.getOrder();
            }
        }
        throw new IllegalArgumentException();
    }
}
