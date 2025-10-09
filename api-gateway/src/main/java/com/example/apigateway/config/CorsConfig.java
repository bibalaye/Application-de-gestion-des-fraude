package com.example.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allow all origins (for development and Docker)
        corsConfig.setAllowedOriginPatterns(List.of("*"));
        corsConfig.addAllowedOrigin("http://localhost");
        corsConfig.addAllowedOrigin("http://localhost:80");
        corsConfig.addAllowedOrigin("http://localhost:4200");
        corsConfig.addAllowedOrigin("http://127.0.0.1");
        corsConfig.addAllowedOrigin("http://frontend");
        
        // Allow all methods
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        
        // Allow all headers
        corsConfig.setAllowedHeaders(List.of("*"));
        corsConfig.addAllowedHeader("Authorization");
        corsConfig.addAllowedHeader("Content-Type");
        corsConfig.addAllowedHeader("Accept");
        corsConfig.addAllowedHeader("Origin");
        corsConfig.addAllowedHeader("X-Requested-With");
        corsConfig.addAllowedHeader("X-Forwarded-For");
        corsConfig.addAllowedHeader("X-Forwarded-Host");
        corsConfig.addAllowedHeader("X-Forwarded-Proto");
        
        // Allow credentials
        corsConfig.setAllowCredentials(true);
        
        // Cache preflight for 1 hour
        corsConfig.setMaxAge(3600L);
        
        // Expose headers
        corsConfig.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Total-Count"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
