package com.softeer.reacton.domain.professor.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonPropertyOrder({"name", "email", "imageUrl"})
public class ProfessorInfoResponse {
    private String name;
    private String email;
    private String imageUrl;
}
