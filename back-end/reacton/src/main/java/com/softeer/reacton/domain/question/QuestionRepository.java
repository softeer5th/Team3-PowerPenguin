package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByStudentIdAndCourse(String studentId, Course course);

    void deleteAllByCourse(Course course);
}
