package com.app.backend.web.lib.controllers.booking;

import com.app.backend.domain.booking.Booking;
import com.app.backend.domain.booking.TimeInterval;
import com.app.backend.domain.user.AppUser;
import com.app.backend.service.api.IBookingService;
import com.app.backend.web.lib.DTO.booking.BookingDetailsResponse;
import com.app.backend.web.lib.DTO.booking.BookingRequest;
import com.app.backend.web.lib.DTO.booking.BookingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/booking")

public class BookingController {

    private final IBookingService bookingService;
    private final BookingMapper bookingMapper;

    @Autowired
    public BookingController(IBookingService bookingService, BookingMapper bookingMapper) {
        this.bookingService = bookingService;
        this.bookingMapper = bookingMapper;
    }

        @PostMapping
        public ResponseEntity<?> createBooking(
                @RequestBody BookingRequest dto,
                @AuthenticationPrincipal AppUser user) {

            System.out.println("Req by user: " + user);

            TimeInterval interval = new TimeInterval(dto.getStartTime(), dto.getEndTime());

            try {
                Booking booking = bookingService.createBooking(
                        dto.getRoomId(),
                        dto.getNamedGroupId(),
                        dto.getDate(),
                        interval,
                        user);

                System.out.println("Booking created: " + booking.toString() );

                return ResponseEntity.ok(bookingMapper.toDto(booking));
            }
            catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
            }
        }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateBooking(
            @PathVariable Long id,
            @RequestBody BookingRequest dto,
            @AuthenticationPrincipal AppUser user) {

        System.out.println("Req by user: " + user);

        System.out.println("Received BookingRequest: " + dto);
        System.out.println("StartTime: " + dto.getStartTime());
        System.out.println("EndTime: " + dto.getEndTime());

        TimeInterval interval = new TimeInterval(dto.getStartTime(), dto.getEndTime());

        Booking booking = bookingService.updateBooking(
                id,
                dto.getRoomId(),
                dto.getNamedGroupId(),
                dto.getDate(),
                interval,
                user);

        return ResponseEntity.ok(bookingMapper.toDto(booking));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal AppUser user) {

        System.out.println("Req by user: " + user);
        bookingService.deleteBooking(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDetailsResponse> getBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal AppUser user) {

        try {
            System.out.println("Req by user: " + user);
            Booking booking = bookingService.getBooking(id, user);
            return ResponseEntity.ok(bookingMapper.toDetailDto(booking));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> listBookings(
            @AuthenticationPrincipal AppUser user) {

        System.out.println("Req by user: " + user);

        List<Booking> bookings = bookingService.getAllBookings(user);
        List<BookingResponse> dtos = bookings.stream()
                .map(bookingMapper::toDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }
}
