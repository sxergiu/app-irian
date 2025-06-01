package com.app.backend.service;

import com.app.backend.domain.booking.Booking;
import com.app.backend.domain.booking.BookingJPARepository;
import com.app.backend.domain.booking.TimeInterval;
import com.app.backend.domain.group.GroupJPARepository;
import com.app.backend.domain.group.NamedGroup;
import com.app.backend.domain.room.Room;
import com.app.backend.domain.room.RoomJPARepository;
import com.app.backend.domain.user.AppUser;
import com.app.backend.service.api.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service

public class BookingService implements IBookingService {

    private final BookingJPARepository bookingRepository;
    private final RoomJPARepository roomRepository;
    private final GroupJPARepository namedGroupRepository;

    public BookingService(BookingJPARepository bookingRepository, RoomJPARepository roomRepository,
                          GroupJPARepository namedGroupRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.namedGroupRepository = namedGroupRepository;
    }

    @Override
    public Booking createBooking(Long roomId, Long namedGroupId, LocalDate date, TimeInterval time, AppUser user) {

        Room room = fetchValidatedRoom(roomId, date, time.getStartTime(), time.getEndTime());
        NamedGroup group = fetchValidatedNamedGroup(namedGroupId, room);

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setNamedGroup(group);
        booking.setDate(date);
        booking.setTime(time);
        booking.setUser(user);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking updateBooking(Long id, Long roomId, Long namedGroupId, LocalDate date, TimeInterval time, AppUser user) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!user.isAdmin() && !booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized - update booking");
        }

        List<Booking> overlaps = bookingRepository.findOverlappingBookingsExcludingId(
                roomId, date, time.getStartTime(), time.getEndTime(), id
        );


        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("New time slot overlaps with existing bookings.");
        }

        Room room = putBooking(roomId, date, time.getStartTime(), time.getEndTime(),id);
        NamedGroup group = fetchValidatedNamedGroup(namedGroupId, room);

        booking.setRoom(room);
        booking.setNamedGroup(group);
        booking.setDate(date);
        booking.setTime(time);

        return bookingRepository.save(booking);
    }

    @Override
    public void deleteBooking(Long id, AppUser user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!user.isAdmin() && !booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized - delete booking");
        }

        bookingRepository.delete(booking);
    }

    @Override
    public Booking getBooking(Long id, AppUser user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!user.isAdmin() && !booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized - view booking");
        }

        return booking;
    }

    @Override
    public List<Booking> getAllBookings(AppUser user) {
        return user.isAdmin()
                ? bookingRepository.findAll()
                : bookingRepository.findByUser(user);
    }

    private NamedGroup fetchValidatedNamedGroup(Long namedGroupId, Room room) {
        NamedGroup group = namedGroupRepository.findById(namedGroupId)
                .orElseThrow(() -> new RuntimeException("Named group not found"));
        if (group.getNumberOfPeople() > room.getCapacity()) {
            throw new RuntimeException("Room cannot accommodate group size");
        }
        return group;
    }

    private Room fetchValidatedRoom(Long roomId, LocalDate date, LocalTime start, LocalTime end) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if (bookingRepository.existsOverlapping(room.getId(), date, start, end)) {
            throw new RuntimeException("Booking overlaps with existing one");
        }
        return room;
    }

    private Room putBooking(Long roomId, LocalDate date, LocalTime start, LocalTime end, Long bookingId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        if (!bookingRepository.findOverlappingBookingsExcludingId(room.getId(), date, start, end, bookingId).isEmpty()) {
            throw new RuntimeException("Booking overlaps with existing one");
        }
        return room;
    }


}
