package com.softeer.reacton.domain.request;

import com.softeer.reacton.domain.request.dto.RequestSendRequest;
import com.softeer.reacton.domain.request.dto.RequestSseRequest;
import com.softeer.reacton.global.sse.SseMessageSender;
import com.softeer.reacton.global.sse.dto.SseMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentRequestService {

    private final SseMessageSender sseMessageSender;
    private final RequestService requestService;

    public void sendRequest(Long courseId, RequestSendRequest requestSendRequest) {
        String content = requestSendRequest.getContent();
        log.debug("요청 처리를 시작합니다. : content = {}", content);

        requestService.incrementRequestCount(content, courseId);

        RequestSseRequest requestSseRequest = new RequestSseRequest(content);

        log.debug("SSE 서버에 요청 전송을 요청합니다.");
        SseMessage<RequestSseRequest> sseMessage = new SseMessage<>("REQUEST", requestSseRequest);
        sseMessageSender.sendMessage(courseId.toString(), sseMessage);
    }
}
