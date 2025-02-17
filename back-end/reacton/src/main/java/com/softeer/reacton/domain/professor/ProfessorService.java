package com.softeer.reacton.domain.professor;

import com.softeer.reacton.domain.course.Course;
import com.softeer.reacton.domain.course.CourseRepository;
import com.softeer.reacton.domain.professor.dto.ProfessorInfoResponse;
import com.softeer.reacton.domain.question.QuestionRepository;
import com.softeer.reacton.domain.request.RequestRepository;
import com.softeer.reacton.domain.schedule.ScheduleRepository;
import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.FileErrorCode;
import com.softeer.reacton.global.exception.code.ProfessorErrorCode;
import com.softeer.reacton.global.jwt.JwtTokenUtil;
import com.softeer.reacton.global.s3.S3Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfessorService {
    private final JwtTokenUtil jwtTokenUtil;
    private final ProfessorRepository professorRepository;
    private final CourseRepository courseRepository;
    private final ScheduleRepository scheduleRepository;
    private final QuestionRepository questionRepository;
    private final RequestRepository requestRepository;
    private final S3Service s3Service;

    private static final Set<String> ALLOWED_IMAGE_FILE_EXTENSIONS = Set.of("png", "jpg", "jpeg", "heic");
    private static final long MAX_IMAGE_FILE_SIZE = 5L * 1024 * 1024;
    private static final String PROFILE_DIRECTORY = "profiles/";

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

        String fileName = null;
        String s3Key = null;

        if (!profileImageFile.isEmpty()) {
            fileName = profileImageFile.getOriginalFilename();
            validateProfileImage(profileImageFile.getSize(), fileName);
            s3Key = s3Service.uploadFile(profileImageFile, PROFILE_DIRECTORY);
        }

        Professor professor = Professor.builder()
                .oauthId(oauthId)
                .email(email)
                .name(name)
                .profileImageFilename(fileName)
                .profileImageS3Key(s3Key)
                .build();
        professorRepository.save(professor);

        log.debug("회원가입 처리를 완료했습니다. : email = {}, name = {}", email, name);

        return jwtTokenUtil.createAuthAccessToken(oauthId, email);
    }

    @Transactional
    public void delete(String oauthId) {
        Professor professor = professorRepository.findByOauthId(oauthId)
                .orElseThrow(() -> new BaseException(ProfessorErrorCode.PROFESSOR_NOT_FOUND));
        s3Service.deleteFile(professor.getProfileImageS3Key());

        courseRepository.findByProfessor(professor).forEach(course -> {
            scheduleRepository.deleteAllByCourse((Course) course);
            questionRepository.deleteAllByCourse((Course) course);
            requestRepository.deleteAllByCourse((Course) course);
        });
        courseRepository.deleteByProfessor(professor);
        professorRepository.delete(professor);

        log.debug("회원 탈퇴 처리를 완료했습니다. : email = {}", professor.getEmail());
    }

    public ProfessorInfoResponse getProfileInfo(String oauthId) {
        log.debug("사용자의 이름, 이메일 주소를 가져옵니다.");

        Optional<Professor> existingUser = professorRepository.findByOauthId(oauthId);

        Professor professor = existingUser.orElseThrow(() -> {
            log.debug("사용자 정보를 가져오는 과정에서 발생한 에러입니다. : User does not exist.");
            return new BaseException(ProfessorErrorCode.USER_NOT_FOUND);
        });

        URL profileImageUrl = s3Service.generatePresignedUrl(professor.getProfileImageS3Key(), 1);
        return new ProfessorInfoResponse(professor.getName(), professor.getEmail(), String.valueOf(profileImageUrl));
    }

    public Map<String, String> getProfileImage(String oauthId) {
        log.debug("사용자의 프로필 이미지를 가져옵니다.");

        Optional<Professor> existingUser = professorRepository.findByOauthId(oauthId);

        Professor professor = existingUser.orElseThrow(() -> {
            log.debug("사용자 정보를 가져오는 과정에서 발생한 에러입니다. : User does not exist.");
            return new BaseException(ProfessorErrorCode.USER_NOT_FOUND);
        });

        // TODO: S3 도입 후 imageUrl을 리턴하도록 수정 필요
        return Map.of("imageUrl", professor.getProfileImageFilename());
    }

    public Map<String, String> updateName(String oauthId, String newName) {
        log.debug("사용자의 이름을 수정합니다. : newName = {}", newName);

        int updatedRows = professorRepository.updateName(oauthId, newName);
        if (updatedRows == 0) {
            log.debug("사용자 정보를 가져오는 과정에서 발생한 에러입니다. : User does not exist.");
            throw new BaseException(ProfessorErrorCode.USER_NOT_FOUND);
        }

        log.debug("이름 수정이 완료되었습니다.");

        return Map.of("name", newName);
    }

    public Map<String, String> updateImage(String oauthId, MultipartFile profileImageFile) {
        log.debug("사용자의 프로필 이미지를 수정합니다.");

        String existingS3Key = professorRepository.getProfileImageS3KeyByOauthId(oauthId);
        String profileImageFilename = "";
        String profileImageS3Key = "";
        URL imageUrl = null;

        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            profileImageFilename = profileImageFile.getOriginalFilename();
            profileImageS3Key = s3Service.uploadFile(profileImageFile, PROFILE_DIRECTORY);
            validateProfileImage(profileImageFile.getSize(), profileImageFilename);
            imageUrl = s3Service.generatePresignedUrl(profileImageS3Key, 1);
        } else {
            log.debug("새로운 프로필 이미지가 제공되지 않았으므로 기존 이미지 삭제.");
        }

        if (existingS3Key != null && !existingS3Key.isEmpty()) {
            s3Service.deleteFile(existingS3Key);
            log.debug("기존 프로필 이미지({})를 S3에서 삭제했습니다.", existingS3Key);
        }
        updateUserProfileImage(oauthId, profileImageFilename, profileImageS3Key);

        log.debug("프로필 이미지 수정이 완료되었습니다.");
        return Map.of("imageUrl", imageUrl != null ? imageUrl.toString() : "");
    }

    private void validateProfileImage(Long fileSize, String fileName) {
        if (fileSize > MAX_IMAGE_FILE_SIZE) {
            throw new BaseException(FileErrorCode.FILE_SIZE_EXCEEDED);
        }

        if (fileName != null) {
            String fileExtension = getFileExtension(fileName);
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

    private byte[] getImageBytes(MultipartFile profileImageFile) {
        byte[] imageBytes = null;
        if (profileImageFile != null && !profileImageFile.isEmpty()) {
            validateProfileImage(profileImageFile.getSize(), profileImageFile.getOriginalFilename());
            try {
                imageBytes = profileImageFile.getBytes();
            } catch (IOException e) {
                log.debug("회원가입 처리 과정에서 발생한 에러입니다. : {}", e.getMessage());
                throw new BaseException(ProfessorErrorCode.IMAGE_PROCESSING_FAILURE);
            }
        }

        return imageBytes;
    }

    private void updateUserProfileImage(String oauthId, String profileImageFilename, String profileImageS3Key) {
        try {
            int updatedRows = professorRepository.updateImage(oauthId, profileImageFilename, profileImageS3Key);
            if (updatedRows == 0) {
                throw new BaseException(ProfessorErrorCode.USER_NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("프로필 이미지 업데이트 중 오류 발생: {}", e.getMessage(), e);

            if (profileImageS3Key != null && !profileImageS3Key.isEmpty()) {
                s3Service.deleteFile(profileImageS3Key);
                log.debug("DB 업데이트 실패로 인해 새로 업로드한 프로필 이미지({})를 S3에서 삭제했습니다.", profileImageS3Key);
            }

            throw e;
        }
    }
}
