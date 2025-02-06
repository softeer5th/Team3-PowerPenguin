package com.softeer.reacton.domain.professor;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.FileErrorCode;
import com.softeer.reacton.global.exception.code.ProfessorErrorCode;
import com.softeer.reacton.global.jwt.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@Log4j2
@Service
@RequiredArgsConstructor
public class ProfessorService {
    private final ProfessorRepository professorRepository;
    private final JwtTokenUtil jwtTokenUtil;

    private static final Set<String> ALLOWED_IMAGE_FILE_EXTENSIONS = Set.of("png", "jpg", "jpeg", "heic");
    private static final long MAX_IMAGE_FILE_SIZE = 64 * 1024;

    public String signUp(String name, MultipartFile profileImageFile, String oauthId, String email, Boolean isSignedUp) {
        log.debug("회원가입 처리를 시작합니다.");
      
        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            validateProfileImage(profileImageFile);
        }

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

    private void validateProfileImage(MultipartFile file) {
        if (file.getSize() > MAX_IMAGE_FILE_SIZE) {
            throw new BaseException(FileErrorCode.FILE_SIZE_EXCEEDED);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String fileExtension = getFileExtension(originalFilename);
            if (!ALLOWED_IMAGE_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
                throw new BaseException(FileErrorCode.INVALID_FILE_TYPE);
            }
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return ""; // 확장자가 없는 경우
        }
        return filename.substring(lastDotIndex + 1);
    }

}
