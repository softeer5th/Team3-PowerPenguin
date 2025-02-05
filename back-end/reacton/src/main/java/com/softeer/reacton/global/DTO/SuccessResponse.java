package com.softeer.reacton.global.DTO;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class SuccessResponse<T> {
    private boolean success;
    private String message;
    private T data;
}