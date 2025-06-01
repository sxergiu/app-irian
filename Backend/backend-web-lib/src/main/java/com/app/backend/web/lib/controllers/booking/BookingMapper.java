package com.app.backend.web.lib.controllers.booking;

import com.app.backend.domain.booking.Booking;
import com.app.backend.domain.booking.TimeInterval;
import com.app.backend.domain.group.NamedGroup;
import com.app.backend.domain.room.Room;
import com.app.backend.domain.user.AppUser;
import com.app.backend.web.lib.DTO.availability.TimeIntervalDTO;
import com.app.backend.web.lib.DTO.booking.BookingDetailsResponse;
import com.app.backend.web.lib.DTO.booking.BookingResponse;
import com.app.backend.web.lib.DTO.group.NamedGroupResponse;
import com.app.backend.web.lib.DTO.room.RoomResponse;
import com.app.backend.web.lib.DTO.user.UserResponse;
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
        dto.setStartTime(booking.getTime().getStartTime());
        dto.setEndTime(booking.getTime().getEndTime());

        if (booking.getUser() != null) {
            dto.setUserId(booking.getUser().getId());
            dto.setUserName(booking.getUser().getName()); // or other display name
        }

        return dto;
    }

    public BookingDetailsResponse toDetailDto(Booking booking) {

        Room room = booking.getRoom();
        NamedGroup group = booking.getNamedGroup();
        AppUser user = booking.getUser();

        RoomResponse roomDto = new RoomResponse(room.getId(), room.getName(), room.getLocation(),
                room.getCapacity(), room.getAmenities(), room.getCoordinates());

        NamedGroupResponse groupDto = new NamedGroupResponse(group.getId(), group.getName(), group.getNumberOfPeople());

        UserResponse userDto = new UserResponse(user.getId(), user.getName(), user.getEmail());

        return new BookingDetailsResponse(
                booking.getId(), booking.getDate(), booking.getTime().getStartTime(), booking.getTime().getEndTime(),
                groupDto, userDto, roomDto
        );

    }
}

