package com.softeer.reacton.global.s3;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class S3Config {
    @Value("${aws.region}")
    private String AWS_REGION;

    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(AWS_REGION))
                .credentialsProvider(ProfileCredentialsProvider.create())
                .build();
    }

    @Bean
    public S3Presigner s3Presigner() {
        return S3Presigner.builder()
                .region(Region.of(AWS_REGION))
                .credentialsProvider(ProfileCredentialsProvider.create())
                .build();
    }
}