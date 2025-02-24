package com.softeer.reacton.domain.question;

import com.softeer.reacton.domain.question.dto.QuestionCheckSseRequest;
import com.softeer.reacton.global.sse.SseMessageSender;
import com.softeer.reacton.global.sse.dto.SseMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfessorQuestionService {

    private final SseMessageSender sseMessageSender;
    private final QuestionService questionService;

    public void sendQuestionCheck(Long questionId) {
        log.debug("질문 체크 처리를 시작합니다. : questionId = {}", questionId);

        Question question = questionService.checkQuestion(questionId);
        String studentId = question.getStudentId();

        QuestionCheckSseRequest questionCheckSseRequest = new QuestionCheckSseRequest(questionId);

        log.debug("SSE 서버에 질문 체크 전송을 요청합니다.");
        SseMessage<QuestionCheckSseRequest> sseMessage = new SseMessage<>("QUESTION_CHECK", questionCheckSseRequest);
        sseMessageSender.sendMessage(studentId, sseMessage);

        log.debug("질문 체크 처리가 완료되었습니다.");
    }
}
