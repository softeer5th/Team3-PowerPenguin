package com.softeer.reacton_classroom.domain.sse.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@JsonPropertyOrder({"messageType", "data"})
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponse<T> {
    private String messageType;
    private T data;
}
