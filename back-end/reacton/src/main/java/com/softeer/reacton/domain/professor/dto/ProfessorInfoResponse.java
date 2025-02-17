package com.softeer.reacton.domain.professor.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonPropertyOrder({"name", "email", "profileImageUrl"})
public class ProfessorInfoResponse {
    private String name;
    private String email;
    private String profileImageUrl;
}
