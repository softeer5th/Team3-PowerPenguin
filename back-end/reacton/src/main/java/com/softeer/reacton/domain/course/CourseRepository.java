package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.professor.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
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

    @Query("SELECT DISTINCT c FROM Course c " +
            "LEFT JOIN FETCH c.schedules s " +
            "WHERE c.professor = :professor " +
            "AND (LOWER(c.name) LIKE :keyword ESCAPE '\\' OR LOWER(c.courseCode) LIKE :keyword ESCAPE '\\') " +
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
    List<Course> findCoursesWithSchedulesByProfessorAndKeyword(@Param("professor") Professor professor, @Param("keyword") String keyword);

    Optional<Course> findByAccessCode(int accessCode);

    List<Course> findByProfessor(Professor professor);

    void deleteByProfessor(Professor professor);

    Optional<Course> findTopByProfessorAndIsActiveTrue(Professor professor);

    @Query("SELECT c FROM Course c WHERE c.professor = :professor AND c.isActive = true")
    List<Course> findIsActiveCoursesByProfessor(@Param("professor") Professor professor);
}
