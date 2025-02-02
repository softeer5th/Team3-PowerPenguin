package com.softeer.reacton.global.oauth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private Long id;
    private String name;
    private String email;
    private String imageUrl;
    private String tokenType;
    private String accessToken;
}