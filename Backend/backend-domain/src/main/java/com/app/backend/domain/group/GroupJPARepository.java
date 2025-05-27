package com.app.backend.domain.group;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupJPARepository extends JpaRepository<NamedGroup, Long> {
    Optional<NamedGroup> findByName(String name);
}
