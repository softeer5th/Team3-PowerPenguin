package com.softeer.reacton.global.config;

import com.softeer.reacton.global.security.JWTFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    @Bean
    public FilterRegistrationBean<JWTFilter> jwtFilter() {
        FilterRegistrationBean<JWTFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new JWTFilter());
        registrationBean.addUrlPatterns("/*"); // 모든 경로에 필터 적용
        registrationBean.setOrder(1); // 필터 실행 순서
        return registrationBean;
    }
}
