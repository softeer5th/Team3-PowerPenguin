package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.professor.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT DISTINCT c FROM Course c " +
            "LEFT JOIN FETCH c.schedules " +
            "WHERE c.professor = :professor")
    List<Course> findCoursesWithSchedulesByProfessor(@Param("professor") Professor professor);
}
