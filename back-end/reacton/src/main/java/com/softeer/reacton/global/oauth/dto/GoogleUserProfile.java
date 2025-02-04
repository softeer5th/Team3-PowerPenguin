package com.softeer.reacton.global.oauth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
public class GoogleUserProfile implements UserProfile {
    @JsonProperty("sub")
    private final String oauthId;
    private final String email;

    @Builder
    public GoogleUserProfile(String oauthId, String email) {
        this.oauthId = oauthId;
        this.email = email;
    }
}