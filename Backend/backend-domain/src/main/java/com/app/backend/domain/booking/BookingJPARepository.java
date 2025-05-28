package com.app.backend.domain.booking;

import com.app.backend.domain.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingJPARepository extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.room.id = :roomId AND b.date = :date
        AND ((:startTime < b.endTime AND :endTime > b.startTime))
    """)
    boolean existsOverlapping(Long roomId, LocalDate date, LocalTime startTime, LocalTime endTime);

    List<Booking> findByUser(AppUser user);
}
