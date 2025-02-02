package com.softeer.reacton.domain.professor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByOauthId(String oauthId);
}
