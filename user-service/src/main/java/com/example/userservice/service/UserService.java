package com.example.userservice.service;

import com.example.userservice.dto.UserKPIs;
import com.example.userservice.exception.UserNotFoundException;
import com.example.userservice.model.Role;
import com.example.userservice.model.User;
import com.example.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.userservice.exception.UserAlreadyExistsException;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        
        Collection<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getName()));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .build();
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new UserAlreadyExistsException("Username already exists: " + user.getUsername());
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new UserAlreadyExistsException("Email already exists: " + user.getEmail());
        }
        
        // Ensure role is provided and valid
        if (user.getRole() == null || user.getRole().getId() == null) {
            throw new IllegalArgumentException("Role and Role ID must be provided for new user creation.");
        }
        Role assignedRole = roleService.getRoleById(user.getRole().getId());
        user.setRole(assignedRole); // Set the managed role entity

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus("ACTIVE"); // Default status for new users
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setUpdatedAt(null);
        user.setLastLogin(null);
        user.setLastPasswordChange(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        // Update email if provided and different
        if (user.getEmail() != null && !user.getEmail().isEmpty() && !existingUser.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(user.getEmail()) != null) {
                throw new UserAlreadyExistsException("Email already exists: " + user.getEmail());
            }
            existingUser.setEmail(user.getEmail());
        }
        
        // Update password if provided, not empty, and different from current encoded password
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            // Only re-encode and update if the new password is actually different
            if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
                existingUser.setLastPasswordChange(java.time.LocalDateTime.now());
            }
        }
        
        // Update role if provided
        if (user.getRole() != null && user.getRole().getId() != null) {
            Role role = roleService.getRoleById(user.getRole().getId());
            existingUser.setRole(role);
        }

        // Update status if provided
        if (user.getStatus() != null && !user.getStatus().isEmpty()) {
            existingUser.setStatus(user.getStatus());
        }

        existingUser.setUpdatedAt(java.time.LocalDateTime.now());
        return userRepository.save(existingUser);
    }
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
    public User getLastLogin(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public UserKPIs getUserKPIs() {
        List<User> allUsers = userRepository.findAll();
        long totalUsers = allUsers.size();
        long activeUsers = allUsers.stream().filter(user -> "ACTIVE".equals(user.getStatus())).count();
        long inactiveUsers = totalUsers - activeUsers;

        LocalDate today = LocalDate.now();
        long newUsersToday = allUsers.stream()
                .filter(user -> user.getCreatedAt() != null && user.getCreatedAt().toLocalDate().isEqual(today))
                .count();

        long adminUsers = allUsers.stream()
                .filter(user -> user.getRole() != null && "ADMIN".equals(user.getRole().getName()))
                .count();
        long regularUsers = allUsers.stream()
                .filter(user -> user.getRole() != null && "USER".equals(user.getRole().getName()))
                .count();

        return new UserKPIs(
                totalUsers,
                activeUsers,
                inactiveUsers,
                newUsersToday,
                adminUsers,
                regularUsers
        );
    }
}