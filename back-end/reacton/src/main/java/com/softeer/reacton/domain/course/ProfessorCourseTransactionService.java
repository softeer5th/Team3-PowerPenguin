package com.softeer.reacton.domain.course;

import com.softeer.reacton.domain.course.dto.CourseRequest;
import com.softeer.reacton.domain.professor.Professor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfessorCourseTransactionService {

    private final CourseRepository courseRepository;

    @Transactional
    public long saveCourseWithNewTransaction(CourseRequest request, Professor professor, String accessCode) {
        Course course = Course.create(request, accessCode, professor);
        return courseRepository.save(course).getId();
    }
}
