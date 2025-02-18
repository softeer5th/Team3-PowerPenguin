package com.softeer.reacton.global.sse.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SseMessage<T> {
    private String messageType;
    private T data;
}
