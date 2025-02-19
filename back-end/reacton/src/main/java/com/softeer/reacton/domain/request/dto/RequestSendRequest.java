package com.softeer.reacton.domain.request.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class RequestSendRequest {

    @Pattern(
            regexp = "^(SCREEN_ISSUE|HAVE_QUESTION|DIFFICULT|SOUND_ISSUE|TOO_FAST)$",
            message = "요청에 들어갈 값이 잘못되었습니다."
    )
    private String content;
}
