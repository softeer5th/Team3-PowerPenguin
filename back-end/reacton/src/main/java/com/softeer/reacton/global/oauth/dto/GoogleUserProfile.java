package com.softeer.reacton.global.oauth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.softeer.reacton.domain.professor.Professor;
import lombok.Builder;
import lombok.Getter;

@Getter
public class GoogleUserProfile implements UserProfile {
    @JsonProperty("sub")
    private final String oauthId;
    private final String email;
    private final String name;
    @JsonProperty("picture")
    private final String imageUrl;

    @Builder
    public GoogleUserProfile(String oauthId, String email, String name, String imageUrl) {
        this.oauthId = oauthId;
        this.email = email;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    @Override
    public Professor toProfessor() {
        return Professor.builder()
                .oauthId(oauthId)
                .email(email)
                .name(name)
                .profileImgUrl(imageUrl)
                .build();
    }
}