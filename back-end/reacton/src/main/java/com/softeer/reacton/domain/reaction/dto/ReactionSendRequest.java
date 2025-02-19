package com.softeer.reacton.domain.reaction.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReactionSendRequest {

    @Pattern(
            regexp = "^(OKAY|CLAP|THUMBS_UP|HEART_EYES|CRYING|SURPRISED)$",
            message = "반응에 들어갈 값이 잘못되었습니다."
    )
    private final String content;
}
