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
            "WHERE q.studentId = :studentId AND q.course = :course AND q.isComplete = false")
    List<Question> findNotCompleteByStudentIdAndCourse(String studentId, Course course);

    @Modifying
    @Transactional
    @Query("UPDATE Question q SET q.isComplete = true " +
            "WHERE q.studentId = :studentId AND q.course = :course AND q.id = :questionId")
    int updateQuestion(@Param("studentId") String studentId, @Param("course") Course course, @Param("questionId") Long questionId);

    void deleteAllByCourse(Course course);
}
