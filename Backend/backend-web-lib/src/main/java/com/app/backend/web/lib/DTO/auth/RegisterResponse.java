package com.app.backend.web.lib.DTO.auth;

import com.app.backend.domain.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import org.springframework.stereotype.Service;


public class RegisterResponse {
    private String name;
    private UserRole role;

    public RegisterResponse(String name, UserRole role) {
        this.name = name;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
