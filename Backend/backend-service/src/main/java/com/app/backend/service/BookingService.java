package com.app.backend.service;

import com.app.backend.domain.booking.Booking;
import com.app.backend.domain.booking.BookingJPARepository;
import com.app.backend.domain.group.GroupJPARepository;
import com.app.backend.domain.group.NamedGroup;
import com.app.backend.domain.room.Room;
import com.app.backend.domain.room.RoomJPARepository;
import com.app.backend.domain.user.AppUser;
import com.app.backend.service.api.IBookingService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {

    private final BookingJPARepository bookingRepository;
    private final RoomJPARepository roomRepository;
    private final GroupJPARepository namedGroupRepository;

    @Override
    public Booking createBooking(Long roomId, Long namedGroupId, LocalDate date, LocalTime start, LocalTime end, AppUser user) {


        Room room = fetchValidatedRoom(roomId, date, start, end);
        NamedGroup group = fetchValidatedNamedGroup(namedGroupId, room);

        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setNamedGroup(group);
        booking.setDate(date);
        booking.setStartTime(start);
        booking.setEndTime(end);
        booking.setUser(user);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking updateBooking(Long id, Long roomId, Long namedGroupId, LocalDate date, LocalTime start, LocalTime end, AppUser user) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!user.isAdmin() && !booking.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized - update booking");
        }

        Room room = fetchValidatedRoom(roomId, date, start, end);
        NamedGroup group = fetchValidatedNamedGroup(namedGroupId, room);

        booking.setRoom(room);
        booking.setNamedGroup(group);
        booking.setDate(date);
        booking.setStartTime(start);
        booking.setEndTime(end);

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
}
