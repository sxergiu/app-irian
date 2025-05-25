package com.app.backend.web.lib.controllers;

import com.app.backend.domain.user.AppUser;
import com.app.backend.domain.user.UserRole;
import com.app.backend.service.api.IAuthService;
import com.app.backend.web.lib.DTO.AuthRequest;
import com.app.backend.web.lib.DTO.AuthResponse;
import com.app.backend.web.lib.DTO.RegisterRequest;
import com.app.backend.web.lib.DTO.RegisterResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    private final IAuthService authService;
    private final AuthenticationManager authenticationManager;

    public AuthController(IAuthService authService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {

        String email = request.getEmail();
        String password = request.getPassword();
        String name = request.getName();
        String role = request.getRole();

        AppUser user = authService.registerUser(email, password, name, role);

        return ResponseEntity.ok(new RegisterResponse(user.getName(), user.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Map<String,UserRole> userInfo = authService.generateToken(request.getEmail());

        String token = userInfo.keySet().iterator().next();
        UserRole role = userInfo.values().iterator().next();

        AuthResponse response = new AuthResponse(token, role);
        return ResponseEntity.ok(response);
    }
}