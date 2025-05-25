package com.app.backend.web.lib.DTO;

import com.app.backend.domain.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterResponse {
    private String name;
    private UserRole role;
}
