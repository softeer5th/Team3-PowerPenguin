package com.softeer.reacton;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PerformanceTestRunner implements CommandLineRunner {

    private final PerformanceTestService performanceTestService;

    @Override
    public void run(String... args) {
        System.out.println("📌 시작: 성능 테스트 실행");

        System.out.println("\n--------------------\n");
        System.out.println("새 Course 추가 테스트");
        performanceTestService.testInsertPerformance();

        System.out.println("\n--------------------\n");
        System.out.println("기존 Course 업데이트 테스트");
        performanceTestService.testModifyCourseSchedulePerformance(388888L, 288889L);

        System.out.println("\n--------------------\n");
        System.out.println("Course 조회 테스트");
        performanceTestService.testQueryPerformance(197333L, 5344L);

        System.out.println("✅ 완료: 성능 테스트 종료");
    }
}
