package com.app.backend.web.lib.DTO;

import com.app.backend.domain.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserRole role;
}