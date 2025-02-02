package com.softeer.reacton.global.oauth.dto;

import com.softeer.reacton.domain.professor.Professor;

public interface UserProfile {
    String getOauthId();

    String getEmail();

    String getName();

    String getImageUrl();

    Professor toProfessor();
}
