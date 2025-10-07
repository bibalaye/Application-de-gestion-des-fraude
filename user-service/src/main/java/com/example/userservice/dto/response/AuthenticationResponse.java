package com.example.userservice.dto.response;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
    private String tokenType;
    private Long expiresIn;
    private String username;
    private String email;
    private String role;
    private LocalDateTime loginTime;
}