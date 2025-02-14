package com.softeer.reacton_classroom.sse.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonPropertyOrder({"type", "data"})
public class MessageResponse {
    private String type;
    private String content;
}

