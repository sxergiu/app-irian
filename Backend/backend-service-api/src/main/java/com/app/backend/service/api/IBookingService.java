package com.app.backend.service.api;

import com.app.backend.domain.booking.Booking;
import com.app.backend.domain.booking.TimeInterval;
import com.app.backend.domain.user.AppUser;

import java.time.LocalDate;
import java.util.List;

public interface IBookingService {

    Booking createBooking(Long roomId, Long namedGroupId, LocalDate date, TimeInterval time, AppUser user);

    Booking updateBooking(Long bookingId, Long roomId, Long namedGroupId, LocalDate date, TimeInterval time, AppUser user);

    void deleteBooking(Long bookingId, AppUser user);

    Booking getBooking(Long bookingId, AppUser user);

    List<Booking> getAllBookings(AppUser user);
}
