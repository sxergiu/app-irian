package com.app.backend.web.lib.controllers;

import com.app.backend.domain.AppUser;
import com.app.backend.service.api.IAuthService;
import com.app.backend.web.lib.DTO.AuthRequest;
import com.app.backend.web.lib.DTO.AuthResponse;
import com.app.backend.web.lib.DTO.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final IAuthService authService;
    private final AuthenticationManager authenticationManager;

    public AuthController(IAuthService authService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        String email = request.getEmail();
        String password = request.getPassword();
        String role = request.getRole();

        AppUser user = authService.registerUser(email,password,role);

        return ResponseEntity.ok("User registered successfully: " + user.toString() );
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String jwt = authService.generateToken(request.getEmail());
        return ResponseEntity.ok(jwt);
    }
}