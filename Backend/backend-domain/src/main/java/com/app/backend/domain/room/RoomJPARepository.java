package com.app.backend.domain.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RoomJPARepository extends JpaRepository<Room, Long> {

    boolean existsByName(String name);

    @Query("""
    SELECT r FROM Room r
    WHERE r.capacity >= :minCapacity
    AND :#{#requiredAmenities.size()} = (
        SELECT COUNT(a) FROM r.amenities a WHERE a IN :requiredAmenities
    )
    """)
    List<Room> findByCapacityGreaterThanEqualAndAmenitiesContainingAll(
            @Param("minCapacity") int capacity,
            @Param("requiredAmenities") Set<String> amenities
    );

    Optional<Room> findByName(String name);
}
