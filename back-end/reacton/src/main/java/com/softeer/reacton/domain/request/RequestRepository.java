package com.softeer.reacton.domain.request;

import com.softeer.reacton.domain.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Long> {
    void deleteAllByCourse(Course course);
}
