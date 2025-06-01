package com.app.backend.web.lib.DTO.auth;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
