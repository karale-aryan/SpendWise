package com.spendwise.service;

import com.spendwise.dto.AuthResponse;
import com.spendwise.dto.LoginRequest;
import com.spendwise.dto.RegisterRequest;
import com.spendwise.entity.Role;
import com.spendwise.entity.User;
import com.spendwise.repository.UserRepository;
import com.spendwise.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

/**
 * Service for handling authentication operations.
 * Manages user registration and login.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    /**
     * Register a new user.
     *
     * @param request registration request
     * @return authentication response with JWT token
     * @throws RuntimeException if username or email already exists
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }

        // Create new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Hash password with BCrypt
                .roles(Set.of(Role.USER)) // Default role
                .enabled(true)
                .build();

        // Save user to database
        User savedUser = userRepository.save(user);

        // Generate JWT token
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(savedUser.getUsername())
                .password(savedUser.getPassword())
                .roles(Role.USER.name())
                .build();

        String token = jwtUtil.generateToken(userDetails);

        // Return response
        return AuthResponse.builder()
                .token(token)
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .roles(savedUser.getRoles())
                .build();
    }

    /**
     * Authenticate user and generate JWT token.
     *
     * @param request login request
     * @return authentication response with JWT token
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        // Get authenticated user details
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Generate JWT token
        String token = jwtUtil.generateToken(userDetails);

        // Get user from database
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Return response
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .build();
    }

}
