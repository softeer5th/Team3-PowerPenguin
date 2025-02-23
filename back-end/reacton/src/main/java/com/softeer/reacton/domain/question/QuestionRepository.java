package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    @Query("SELECT q FROM Question q " +
            "WHERE q.course = :course AND q.isComplete = false")
    List<Question> findNotCompleteByCourse(Course course);

    @Query("SELECT q FROM Question q " +
            "WHERE q.studentId = :studentId AND q.course = :course AND q.isComplete = false")
    List<Question> findNotCompleteByStudentIdAndCourse(String studentId, Course course);

    @Modifying
    @Transactional
    @Query("DELETE FROM Question q " +
            "WHERE q.course = :course AND q.isComplete = true")
    void deleteCompleteByCourse(@Param("course") Course course);

    void deleteAllByCourse(Course course);
}
