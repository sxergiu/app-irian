package com.app.backend.service;

import com.app.backend.config.jwt.JwtUtil;
import com.app.backend.domain.user.AppUser;
import com.app.backend.domain.user.UserJPARepository;
import com.app.backend.domain.user.UserRole;
import com.app.backend.service.api.IAuthService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

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
    public User loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new User(user.getEmail(), user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
    }

    @Override
    public AppUser registerUser(String email, String password, String name, String role) {

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setName(name);
        user.setRole(UserRole.USER);
        //user.setRole(UserRole.valueOf(role)); // Or default to USER

        userRepository.save(user);
        return user;
    }

    private boolean isAdmin(String email) {
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getRole() == UserRole.ADMIN;
    }

    @Override
    public Map<String,UserRole> generateToken(String email) {

        UserDetails userDetails = loadUserByUsername(email);
        UserRole role =  isAdmin(email) ? UserRole.ADMIN : UserRole.USER;

        Map<String,UserRole> loggedUserInfo = new HashMap<>();
        loggedUserInfo.put(jwtUtil.generateToken(userDetails), role);

        return loggedUserInfo;
    }

}
