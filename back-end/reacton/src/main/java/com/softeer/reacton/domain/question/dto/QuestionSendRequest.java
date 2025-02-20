package com.softeer.reacton.domain.question.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuestionSendRequest {
    @NotBlank(message = "질문 내용이 비어 있습니다.")
    @Size(max = 200, message = "질문은 200자를 넘길 수 없습니다.")
    private final String content;
}
