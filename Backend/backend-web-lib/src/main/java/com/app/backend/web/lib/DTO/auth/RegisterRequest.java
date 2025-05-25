package com.app.backend.web.lib.DTO.auth;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // Optional if you assign default role = USER
}
