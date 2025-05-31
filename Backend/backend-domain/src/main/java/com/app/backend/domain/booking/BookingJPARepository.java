package com.app.backend.domain.booking;

import com.app.backend.domain.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

public interface BookingJPARepository extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT COUNT(b) > 0 FROM Booking b
        WHERE b.room.id = :roomId AND b.date = :date
        AND ((:startTime < b.time.endTime AND :endTime > b.time.startTime))
    """)
    boolean existsOverlapping(Long roomId, LocalDate date, LocalTime startTime, LocalTime endTime);

    List<Booking> findByUser(AppUser user);
    List<Booking> findByRoomIdAndDate(Long roomId, LocalDate date);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.room.id = :roomId
        AND b.date = :date
    """)
    List<Booking> findOverlappingBookings(
            @Param("roomId") Long roomId,
            @Param("date") LocalDate date
    );

    @Query("""
    SELECT b FROM Booking b
    WHERE b.room.id = :roomId
      AND b.date = :date
      AND b.id <> :bookingId
      AND (
          (b.time.startTime < :end AND b.time.endTime > :start)
          )
    """)
    List<Booking> findOverlappingBookingsExcludingId(
            @Param("roomId") Long roomId,
            @Param("date") LocalDate date,
            @Param("start") LocalTime start,
            @Param("end") LocalTime end,
            @Param("bookingId") Long bookingId
    );

}
