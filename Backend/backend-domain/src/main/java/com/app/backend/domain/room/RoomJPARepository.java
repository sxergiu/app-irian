package com.app.backend.domain.room;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomJPARepository extends JpaRepository<Room, Long> {

    boolean existsByName(String name);
}
