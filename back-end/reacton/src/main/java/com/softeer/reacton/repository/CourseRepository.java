package com.softeer.reacton.repository;

import com.softeer.reacton.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT c FROM Course c JOIN FETCH c.schedules WHERE c.id = :courseId")
    Course findCourseWithSchedules(@Param("courseId") Long courseId);
}
