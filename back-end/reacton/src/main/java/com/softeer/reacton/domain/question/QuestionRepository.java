package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.course.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByStudentIdAndCourse(String studentId, Course course);

    @Modifying
    @Query("UPDATE Question q SET q.isComplete = true " +
            "WHERE q.studentId = :studentId AND q.course = :course AND q.id = :questionId")
    int updateQuestion(@Param("studentId") String studentId, @Param("course") Course course, @Param("questionId") Long questionId);

    void deleteAllByCourse(Course course);
}
