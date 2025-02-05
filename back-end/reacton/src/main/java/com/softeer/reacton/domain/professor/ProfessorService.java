package com.softeer.reacton.domain.professor;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.ProfessorErrorCode;
import com.softeer.reacton.global.jwt.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ProfessorService {
    private final ProfessorRepository professorRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public String signUp(String name, MultipartFile profileImageFile, String oauthId, String email, Boolean isSignedUp) {
        if (isSignedUp) {
            throw new BaseException(ProfessorErrorCode.ALREADY_REGISTERED_USER);
        }

        if (professorRepository.findByOauthId(oauthId).isPresent()) {
            throw new BaseException(ProfessorErrorCode.ALREADY_REGISTERED_USER);
        }

        // TODO: 현재 파일을 DB에 저장하지만, 추후 클라우드 스토리지(S3 등)에 업로드하도록 변경 예정
        byte[] imageBytes = null;
        if (profileImageFile != null) {
            try {
                imageBytes = profileImageFile.getBytes();
            } catch (IOException e) {
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

        return jwtTokenUtil.createAuthAccessToken(oauthId, email);
    }
}
