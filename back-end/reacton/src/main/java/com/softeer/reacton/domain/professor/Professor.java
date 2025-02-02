package com.softeer.reacton.domain.professor;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "professor")
@Entity
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(unique = true, length = 255)
    private String oauthId;

    @Column(length = 512)
    private String profileImgUrl;

    @Builder
    public Professor(String email, String name, String oauthId, String profileImgUrl) {
        this.email = email;
        this.name = name;
        this.oauthId = oauthId;
        this.profileImgUrl = profileImgUrl;
    }

    public void updateEmail(String email) {
        this.email = email;
    }

}
