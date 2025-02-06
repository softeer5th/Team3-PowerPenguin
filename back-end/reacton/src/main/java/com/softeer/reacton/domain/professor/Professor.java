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

    @Lob
    @Column(columnDefinition = "BLOB")
    private byte[] profileImage;

    @Builder
    public Professor(String email, String name, String oauthId, byte[] profileImage) {
        this.email = email;
        this.name = name;
        this.oauthId = oauthId;
        this.profileImage = profileImage;
    }

    public void updateEmail(String email) {
        this.email = email;
    }

}
