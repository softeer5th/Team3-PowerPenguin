package com.softeer.reacton.domain.professor;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;

    public ProfessorService(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    public Optional<Professor> findByOauthId(String oauthId) {
        return professorRepository.findByOauthId(oauthId);
    }

    public void save(String oauthId, String email, String name) {
        Professor professor = new Professor();

        professor.setOauthId(oauthId);
        professor.setEmail(email);
        professor.setName(name);

        professorRepository.save(professor);
    }
}
