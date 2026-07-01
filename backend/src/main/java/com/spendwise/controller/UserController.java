package com.spendwise.controller;

import com.spendwise.dto.AuthResponse;
import com.spendwise.dto.UserUpdateDTO;
import com.spendwise.entity.User;
import com.spendwise.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserUpdateDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(UserUpdateDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                // Password not returned
                .build());
    }

    @PutMapping("/me")
    public ResponseEntity<AuthResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserUpdateDTO request) {

        User updatedUser = userService.updateUser(userDetails.getUsername(), request);

        // Return updated user info (not generating new token here, but could if
        // username changes invalids token)
        // For simplicity, returning AuthResponse structure without new token if not
        // needed, or just user details.
        // Actually, if username changes, the token is technically invalid for future
        // requests if it encodes username.
        // But for now let's just return the data. Frontend might need to re-login if
        // username changes.

        return ResponseEntity.ok(AuthResponse.builder()
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .roles(updatedUser.getRoles())
                .token(null) // Token not refreshed here
                .build());
    }
}
