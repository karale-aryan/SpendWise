package com.spendwise.dto;

import com.spendwise.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * DTO for authentication responses.
 * Contains JWT token and user information.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    /**
     * JWT access token
     */
    private String token;

    /**
     * Token type (always "Bearer")
     */
    @Builder.Default
    private String type = "Bearer";

    /**
     * Authenticated user's username
     */
    private String username;

    /**
     * User's email address
     */
    private String email;

    /**
     * User's roles
     */
    private Set<Role> roles;

}
