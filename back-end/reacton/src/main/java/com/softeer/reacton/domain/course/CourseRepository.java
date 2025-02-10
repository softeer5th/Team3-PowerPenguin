package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.professor.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByAccessCode(int accessCode);

    boolean existsByAccessCode(int accessCode);

    List<Object> findByProfessor(Professor professor);

    void deleteByProfessor(Professor professor);
}
