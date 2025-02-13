package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    void deleteAllByCourse(Course course);
}
