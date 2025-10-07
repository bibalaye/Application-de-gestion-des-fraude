package com.example.userservice.controller;


import com.example.userservice.dto.request.LoginRequest;
import com.example.userservice.dto.request.LogoutRequest;
import com.example.userservice.dto.request.UserRegistrationRequest;
import com.example.userservice.dto.response.AuthenticationResponse;
import com.example.userservice.dto.response.ApiResponse;
import com.example.userservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> registerUser(
            @Valid @RequestBody UserRegistrationRequest request) {
        log.info("Registration attempt for username: {}", request.getUsername());
        
        try {
            AuthenticationResponse response = authService.registerUser(request);
            ApiResponse<AuthenticationResponse> apiResponse = ApiResponse.<AuthenticationResponse>builder()
                    .success(true)
                    .message("User registered successfully")
                    .data(response)
                    .build();
            
            log.info("User registered successfully: {}", request.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
            
        } catch (Exception e) {
            log.error("Registration failed for username: {}", request.getUsername(), e);
            throw e;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> loginUser(
            @Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for username: {}", request.getUsername());
        
        try {
            AuthenticationResponse response = authService.authenticateUser(request);
            ApiResponse<AuthenticationResponse> apiResponse = ApiResponse.<AuthenticationResponse>builder()
                    .success(true)
                    .message("Authentication successful")
                    .data(response)
                    .build();
            
            log.info("User authenticated successfully: {}", request.getUsername());
            return ResponseEntity.ok(apiResponse);
            
        } catch (Exception e) {
            log.error("Authentication failed for username: {}", request.getUsername(), e);
            throw e;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logoutUser(
            @Valid @RequestBody LogoutRequest request) {
        log.info("Logout attempt for username: {}", request.getUsername());
        
        try {
            authService.logoutUser(request);
            ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                    .success(true)
                    .message("Logout successful")
                    .build();
            
            log.info("User logged out successfully: {}", request.getUsername());
            return ResponseEntity.ok(apiResponse);
            
        } catch (Exception e) {
            log.error("Logout failed for username: {}", request.getUsername(), e);
            throw e;
        }
    }
}

