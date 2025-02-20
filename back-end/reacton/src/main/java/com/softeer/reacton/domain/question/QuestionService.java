package com.softeer.reacton.domain.question;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    @Transactional
    public Question save(Question question) {
        return questionRepository.save(question);
    }
}
