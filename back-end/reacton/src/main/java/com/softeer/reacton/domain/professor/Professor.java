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

    @Column(nullable = false, length = 60)
    private String name;

    @Column(unique = true, length = 255)
    private String oauthId;

    @Column
    private String profileImageFilename;

    @Column(length = 512, name = "profile_image_s3_key")
    private String profileImageS3Key;

    @Builder
    public Professor(String email, String name, String oauthId, String profileImageFilename, String profileImageS3Key) {
        this.email = email;
        this.name = name;
        this.oauthId = oauthId;
        this.profileImageFilename = profileImageFilename;
        this.profileImageS3Key = profileImageS3Key;
    }

    public void updateEmail(String email) {
        this.email = email;
    }

}
