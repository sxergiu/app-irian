package com.app.backend.web.lib.controllers.booking;

import com.app.backend.domain.booking.Booking;
import com.app.backend.web.lib.DTO.booking.BookingResponse;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponse toDto(Booking booking) {
        if (booking == null) {
            return null;
        }

        BookingResponse dto = new BookingResponse();

        dto.setId(booking.getId());

        if (booking.getRoom() != null) {
            dto.setRoomId(booking.getRoom().getId());
            dto.setRoomName(booking.getRoom().getName());
            dto.setRoomLocation(booking.getRoom().getLocation());
        }

        if (booking.getNamedGroup() != null) {
            dto.setNamedGroupId(booking.getNamedGroup().getId());
            dto.setNamedGroupName(booking.getNamedGroup().getName());
            dto.setNamedGroupSize(booking.getNamedGroup().getNumberOfPeople());
        }

        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());

        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getId());
            dto.setUserName(booking.getUser().getName()); // or other display name
        }

        return dto;
    }
}

