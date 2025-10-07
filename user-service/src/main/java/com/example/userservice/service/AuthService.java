package com.example.userservice.service;

import com.example.userservice.dto.request.LoginRequest;
import com.example.userservice.dto.request.LogoutRequest;
import com.example.userservice.dto.request.UserRegistrationRequest;
import com.example.userservice.dto.response.AuthenticationResponse;
import com.example.userservice.exception.UserAlreadyExistsException;
import com.example.userservice.exception.UserNotFoundException;
import com.example.userservice.exception.AuthenticationFailedException;
import com.example.userservice.exception.RoleNotFoundException;
import com.example.userservice.model.User;
import com.example.userservice.model.Role;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.repository.RoleRepository;
import com.example.userservice.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final RoleService roleService;
    private final RoleRepository roleRepository;

    @Transactional
    public AuthenticationResponse registerUser(UserRegistrationRequest request) {
        log.debug("Attempting to register user: {}", request.getUsername());

        // Vérification si le nom d'utilisateur existe déjà
        User existingUsername = userRepository.findByUsername(request.getUsername());
        if (existingUsername != null) {
            throw new UserAlreadyExistsException("Username already exists: " + request.getUsername());
        }

        // Vérification si l'email existe déjà
        User existingEmail = userRepository.findByEmail(request.getEmail());
        if (existingEmail != null) {
            throw new UserAlreadyExistsException("Email already exists: " + request.getEmail());
        }

        // Obtenir le rôle par défaut (par exemple, ROLE_USER)
        Role defaultRole = roleRepository.findByName("USER")
                                       .orElseThrow(() -> new RoleNotFoundException("Default role 'USER' not found. Please ensure it exists."));
        
        // Création d'un nouvel utilisateur
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(defaultRole);
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        log.info("utilisateur enregistré avec succès username: {}", savedUser.getUsername());
        // Générer un token pour la connexion immédiate après l'inscription
        UserDetails userDetails = userService.loadUserByUsername(savedUser.getUsername());
        String token = jwtUtil.generateToken(userDetails);
        
        // Calculer l'expiration du token (24 heures en millisecondes)
        long expiresIn = 24 * 60 * 60 * 1000;

        return AuthenticationResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().getName())
                .loginTime(LocalDateTime.now())
                .build();
    }

    public AuthenticationResponse authenticateUser(LoginRequest request) {
        log.debug("Attempting to authenticate user: {}", request.getUsername());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()));
        } catch (BadCredentialsException e) {
            throw new AuthenticationFailedException("Invalid username or password");
        }

        UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new UserNotFoundException("User not found: " + request.getUsername());
        }

        // Vérifier si l'utilisateur est actif
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new AuthenticationFailedException("User account is not active.");
        }

        String token = jwtUtil.generateToken(userDetails);

        // Mettre à jour la dernière connexion
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.info("User authenticated successfully: {}", request.getUsername());
        
        // Calculer l'expiration du token (24 heures en millisecondes)
        long expiresIn = 24 * 60 * 60 * 1000;

        return AuthenticationResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .loginTime(LocalDateTime.now())
                .build();
    }

    @Transactional
    public void logoutUser(LogoutRequest request) {
        log.debug("Attempting to logout user: {}", request.getUsername());

        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new UserNotFoundException("User not found: " + request.getUsername());
        }

        // Mettre à jour la dernière déconnexion
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("User logged out successfully: {}", request.getUsername());

        // Logique de déconnexion supplémentaire peut être ajoutée ici :
        // - Mise en liste noire des tokens
        // - Invalidation de session
        // - Journalisation d'audit
    }
}