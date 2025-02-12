package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.professor.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT DISTINCT c FROM Course c " +
            "LEFT JOIN FETCH c.schedules s " +
            "WHERE c.professor = :professor " +
            "ORDER BY c.createdAt DESC, " +
            "CASE s.day " +
            "WHEN '월' THEN 1 " +
            "WHEN '화' THEN 2 " +
            "WHEN '수' THEN 3 " +
            "WHEN '목' THEN 4 " +
            "WHEN '금' THEN 5 " +
            "WHEN '토' THEN 6 " +
            "WHEN '일' THEN 7 " +
            "ELSE 8 END")
    List<Course> findCoursesWithSchedulesByProfessor(@Param("professor") Professor professor);

    List<Object> findByProfessor(Professor professor);

    void deleteByProfessor(Professor professor);
}
