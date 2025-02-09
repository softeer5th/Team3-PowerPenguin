package com.softeer.reacton.domain.professor;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByOauthId(String oauthId);

    @Modifying
    @Transactional
    @Query("UPDATE Professor p SET p.name = :newName WHERE p.oauthId = :oauthId")
    int updateName(@Param("oauthId") String oauthId, @Param("newName") String newName);

    @Modifying
    @Transactional
    @Query("UPDATE Professor p SET p.profileImage = :newImage WHERE p.oauthId = :oauthId")
    int updateImage(@Param("oauthId") String oauthId, @Param("newImage") byte[] newImage);
}
