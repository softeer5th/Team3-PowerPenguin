package com.softeer.reacton.global.DTO;

import lombok.Getter;

@Getter
public class SuccessResponse<T> {
    private boolean success;
    private String message;
    private T data;
}