package com.app.backend.web.lib.DTO.auth;

import com.app.backend.domain.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;


public class AuthResponse {
    private String token;
    private UserRole role;

    public AuthResponse(String token, UserRole role) {
        this.token = token;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}