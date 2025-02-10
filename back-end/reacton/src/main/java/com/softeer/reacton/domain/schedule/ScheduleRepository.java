package com.softeer.reacton.domain.schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    @Query("SELECT s FROM Schedule s WHERE s.course.id = :courseId " +
            "ORDER BY FIELD(s.day, '월', '화', '수', '목', '금', '토', '일'), s.startTime ASC")
    List<Schedule> findSchedulesByCourseId(@Param("courseId") Long courseId);
}