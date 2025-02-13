package com.softeer.reacton.domain.schedule;

import com.softeer.reacton.domain.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    @Query("SELECT s FROM Schedule s " +
            "WHERE s.course = :course " +
            "ORDER BY CASE s.day " +
            "WHEN '월' THEN 1 " +
            "WHEN '화' THEN 2 " +
            "WHEN '수' THEN 3 " +
            "WHEN '목' THEN 4 " +
            "WHEN '금' THEN 5 " +
            "WHEN '토' THEN 6 " +
            "WHEN '일' THEN 7 " +
            "ELSE 8 END, s.startTime ASC")
    List<Schedule> findSchedulesByCourse(Course course);

    void deleteAllByCourse(Course course);
}
