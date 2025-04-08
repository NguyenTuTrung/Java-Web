package org.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Áp dụng CORS cho tất cả các endpoint
                .allowedOriginPatterns("*")  // Thêm origin frontend của bạn
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")  // Cấu hình các phương thức HTTP cho phép
                .allowedHeaders("*")  // Cho phép tất cả header
                .allowCredentials(true);  // Cho phép cookie và header `Authorization` trong CORS
    }
}