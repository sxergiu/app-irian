package com.app.backend.config;

import com.app.backend.domain.user.AppUser;
import com.app.backend.domain.user.UserJPARepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Lazy @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserJPARepository appUserRepository;     // <— import your JPA repo

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.extractUsername(token);
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 1) validate token against your UserDetails
            UserDetails uds = userDetailsService.loadUserByUsername(email);
            if (jwtUtil.validateToken(token, uds)) {
                // 2) load your AppUser entity
                AppUser appUser = appUserRepository
                        .findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                // 3) build authorities from the AppUser.role
                List<GrantedAuthority> auths = List.of(
                        new SimpleGrantedAuthority("ROLE_" + appUser.getRole().name())
                );

                // 4) set the AppUser as the principal
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(appUser, null, auths);
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth") || path.startsWith("/actuator");
    }
}
