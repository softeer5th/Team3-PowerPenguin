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
import com.softeer.reacton.global.exception.code.S3ErrorCode;
import com.softeer.reacton.global.jwt.JwtTokenUtil;
import com.softeer.reacton.global.s3.S3Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

    private static final Set<String> ALLOWED_IMAGE_FILE_EXTENSIONS = Set.of("png", "jpg", "jpeg");
    private static final long MAX_IMAGE_FILE_SIZE = 5L * 1024 * 1024;
    private static final String PROFILE_DIRECTORY = "profiles/";
    private static final int PRESIGNED_URL_EXPIRATION_MINUTES = 1;

    public String signUp(String name, MultipartFile file, String oauthId, String email, Boolean isSignedUp) {
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
        if (validateProfileImage(file)) {
            fileName = file.getOriginalFilename();
            s3Key = s3Service.uploadFile(file, PROFILE_DIRECTORY);
        }

        Professor professor = Professor.builder()
                .oauthId(oauthId)
                .email(email)
                .name(name)
                .profileImageFileName(fileName)
                .profileImageS3Key(s3Key)
                .build();
        professorRepository.save(professor);

        log.debug("회원가입 처리를 완료했습니다. : email = {}, name = {}, fileName = {}", email, name, fileName);

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

        URL profileImageUrl = s3Service.generatePresignedUrl(professor.getProfileImageS3Key(), PRESIGNED_URL_EXPIRATION_MINUTES);
        return new ProfessorInfoResponse(professor.getName(), professor.getEmail(), String.valueOf(profileImageUrl));
    }

    public Map<String, String> getProfileImage(String oauthId) {
        log.debug("사용자의 프로필 이미지를 가져옵니다.");

        Optional<Professor> existingUser = professorRepository.findByOauthId(oauthId);

        Professor professor = existingUser.orElseThrow(() -> {
            log.debug("사용자 정보를 가져오는 과정에서 발생한 에러입니다. : User does not exist.");
            return new BaseException(ProfessorErrorCode.USER_NOT_FOUND);
        });

        return Map.of("imageFileName", professor.getProfileImageFileName());
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

    public Map<String, String> updateImage(String oauthId, MultipartFile file) {
        log.debug("사용자의 프로필 이미지를 수정합니다.");
        Professor professor = professorRepository.findByOauthId(oauthId)
                .orElseThrow(() -> new BaseException(ProfessorErrorCode.PROFESSOR_NOT_FOUND));

        deleteExistingFileIfExists(professor);

        String profileImageFileName = null;
        String profileImageS3Key = null;
        String imageUrl = "";
        if (validateProfileImage(file)) {
            profileImageFileName = file.getOriginalFilename();
            profileImageS3Key = s3Service.uploadFile(file, PROFILE_DIRECTORY);
            imageUrl = s3Service.generatePresignedUrl(profileImageS3Key, PRESIGNED_URL_EXPIRATION_MINUTES).toString();
        } else {
            log.debug("새로운 프로필 이미지가 제공되지 않았으므로 기존 이미지를 삭제합니다.");
        }

        updateUserProfileImage(oauthId, profileImageFileName, profileImageS3Key);

        log.debug("프로필 이미지 수정이 완료되었습니다.");
        return Map.of("imageUrl", imageUrl);
    }

    private boolean validateProfileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        if (file.getSize() > MAX_IMAGE_FILE_SIZE) {
            throw new BaseException(FileErrorCode.IMAGE_FILE_SIZE_EXCEEDED);
        }

        String fileName = file.getOriginalFilename();
        if (fileName != null && !fileName.isEmpty()) {
            String fileExtension = getFileExtension(file.getOriginalFilename());
            if (!ALLOWED_IMAGE_FILE_EXTENSIONS.contains(fileExtension.toLowerCase())) {
                throw new BaseException(FileErrorCode.INVALID_IMAGE_FILE_TYPE);
            }
        }

        return true;
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf(".");
        if (lastDotIndex == -1) {
            return ""; // 확장자가 없는 경우
        }
        return fileName.substring(lastDotIndex + 1);
    }

    private void updateUserProfileImage(String oauthId, String profileImageFileName, String profileImageS3Key) {
        try {
            int updatedRows = professorRepository.updateImage(oauthId, profileImageFileName, profileImageS3Key);
            if (updatedRows == 0) {
                throw new BaseException(ProfessorErrorCode.USER_NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("프로필 이미지 업데이트 중 오류가 발생했습니다.");

            if (profileImageS3Key != null && !profileImageS3Key.isEmpty()) {
                s3Service.deleteFile(profileImageS3Key);
                log.debug("DB 업데이트 실패로 인해 새로 업로드한 프로필 이미지({})를 S3에서 삭제했습니다.", profileImageS3Key);
            }
            throw new BaseException(S3ErrorCode.S3_INTERNAL_ERROR);
        }
    }

    private void deleteExistingFileIfExists(Professor professor) {
        if (professor.getProfileImageFileName() != null && !professor.getProfileImageFileName().isEmpty() && professor.getProfileImageS3Key() != null && !professor.getProfileImageS3Key().isEmpty()) {
            s3Service.deleteFile(professor.getProfileImageS3Key());
            log.debug("기존 프로필 이미지({})를 S3에서 삭제했습니다.", professor.getProfileImageS3Key());
        }
    }
}
