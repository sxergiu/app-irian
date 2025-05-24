package com.app.backend.service.api;

import com.app.backend.domain.AppUser;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface IAuthService extends UserDetailsService {

    UserDetails loadUserByUsername(String email);
    AppUser registerUser(String email, String password, String Role);
    String generateToken(String email);
}
