package com.app.backend.service;

import com.app.backend.config.JwtUtil;
import com.app.backend.domain.AppUser;
import com.app.backend.domain.UserJPARepository;
import com.app.backend.domain.UserRole;
import com.app.backend.service.api.IAuthService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService implements IAuthService {

    private final UserJPARepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserJPARepository userRepository,
                       PasswordEncoder encoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new User(user.getEmail(), user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
    }

    @Override
    public AppUser registerUser(String email, String password, String role) {

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setRole(UserRole.valueOf(role)); // Or default to USER

        userRepository.save(user);
        return user;
    }

    @Override
    public String generateToken(String email) {
        UserDetails userDetails = loadUserByUsername(email);
        return jwtUtil.generateToken(userDetails);
    }


}
