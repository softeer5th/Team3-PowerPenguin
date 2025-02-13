package com.softeer.reacton;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing
public class ReactonApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReactonApplication.class, args);
	}

}
