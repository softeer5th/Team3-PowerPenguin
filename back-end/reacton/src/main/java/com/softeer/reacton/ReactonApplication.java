package com.softeer.reacton;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing
public class ReactonApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactonApplication.class, args);
		// PR 생성시 자동으로 Assignees 추가하는 워크플로우 테스트 용
		// PR에 commit 올리면 자동으로 Assignees 추가하는 워크플로우 테스트 용
	}

}
