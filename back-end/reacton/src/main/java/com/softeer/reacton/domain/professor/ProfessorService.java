package com.softeer.reacton.domain.professor;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.ProfessorErrorCode;
import com.softeer.reacton.global.jwt.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Log4j2
@Service
@RequiredArgsConstructor
public class ProfessorService {
    private final ProfessorRepository professorRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public String signUp(String name, MultipartFile profileImageFile, String oauthId, String email, Boolean isSignedUp) {
        log.debug("회원가입 처리를 시작합니다.");

        if (isSignedUp) {
            log.debug("회원가입 처리 과정에서 발생한 에러입니다. : 'isSignedUp' token value is true.");
            throw new BaseException(ProfessorErrorCode.ALREADY_REGISTERED_USER);
        }

        if (professorRepository.findByOauthId(oauthId).isPresent()) {
            log.debug("회원가입 처리 과정에서 발생한 에러입니다. : User already registered.");
            throw new BaseException(ProfessorErrorCode.ALREADY_REGISTERED_USER);
        }

        // TODO: 현재 파일을 DB에 저장하지만, 추후 클라우드 스토리지(S3 등)에 업로드하도록 변경 예정
        byte[] imageBytes = null;
        if (profileImageFile != null) {
            try {
                imageBytes = profileImageFile.getBytes();
            } catch (IOException e) {
                log.debug("회원가입 처리 과정에서 발생한 에러입니다. : {}", e.getMessage());
                throw new BaseException(ProfessorErrorCode.IMAGE_PROCESSING_FAILURE);
            }
        }

        Professor professor = Professor.builder()
                .oauthId(oauthId)
                .email(email)
                .name(name)
                .profileImage(imageBytes)
                .build();
        professorRepository.save(professor);

        log.debug("회원가입 처리를 완료했습니다. : email = {}, name = {}", email, name);

        return jwtTokenUtil.createAuthAccessToken(oauthId, email);
    }
}
