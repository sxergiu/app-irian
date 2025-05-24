package com.app.backend.service.api;

import com.app.backend.domain.AppUser;
import com.app.backend.domain.UserRole;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Map;

public interface IAuthService extends UserDetailsService {

    UserDetails loadUserByUsername(String email);
    AppUser registerUser(String email, String password, String name, String Role);
    Map<String,UserRole> generateToken(String email);

}
