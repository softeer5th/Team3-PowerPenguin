package com.softeer.reacton.global.s3;

import com.softeer.reacton.global.exception.BaseException;
import com.softeer.reacton.global.exception.code.FileErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {
    private final S3Client s3Client;

    @Value("${aws.bucket.name}")
    private String bucketName;

    public String uploadFile(MultipartFile file, String folder) {
        String fileName = folder + generateFileName(file);
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            log.info("S3 파일 업로드 완료: {}", fileName);
            return fileName;
        } catch (IOException e) {
            log.error(FileErrorCode.FILE_READ_FAILED.getMessage());
            throw new BaseException(FileErrorCode.FILE_READ_FAILED);
        } catch (S3Exception e) {
            log.error("S3 파일 업로드 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    public void deleteFile(String key) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);

            log.info("S3 파일 삭제 완료: {}", key);
        } catch (S3Exception e) {
            log.error("S3 파일 삭제 실패: {}", e.getMessage(), e);
            throw e;
        }
    }


    private String generateFileName(MultipartFile file) {
        return UUID.randomUUID() + "." + file.getOriginalFilename();
    }
}