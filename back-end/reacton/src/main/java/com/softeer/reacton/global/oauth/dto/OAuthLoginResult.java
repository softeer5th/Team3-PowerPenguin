package com.softeer.reacton.global.oauth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class OAuthLoginResult {
    private final String accessToken;
    private final boolean isSignedUp;
}