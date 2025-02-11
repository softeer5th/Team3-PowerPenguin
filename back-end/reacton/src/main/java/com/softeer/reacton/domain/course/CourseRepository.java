package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.professor.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT DISTINCT c FROM Course c " +
            "LEFT JOIN FETCH c.schedules s " +
            "WHERE s.day = :day AND c.professor = :professor " +
            "ORDER BY s.startTime ASC")
    List<Course> findCoursesByDayAndProfessor(@Param("day") String day, @Param("professor") Professor professor);

    @Query("SELECT DISTINCT c FROM Course c " +
            "LEFT JOIN FETCH c.schedules s " +
            "WHERE c.professor = :professor " +
            "ORDER BY c.createdAt DESC")
    List<Course> findCoursesByProfessor(@Param("professor") Professor professor);
}
