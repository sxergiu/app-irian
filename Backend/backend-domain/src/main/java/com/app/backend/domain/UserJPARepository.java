package com.app.backend.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserJPARepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String username);
}
