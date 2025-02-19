package com.softeer.reacton.domain.request;

import com.softeer.reacton.domain.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RequestRepository extends JpaRepository<Request, Long> {
    void deleteAllByCourse(Course course);

    @Modifying
    @Query("UPDATE Request r " +
            "SET r.count = r.count + 1 " +
            "WHERE r.course = :course " +
            "  AND r.type = :type")
    int incrementCount(@Param("course") Course course,
                       @Param("type") String type);
}
