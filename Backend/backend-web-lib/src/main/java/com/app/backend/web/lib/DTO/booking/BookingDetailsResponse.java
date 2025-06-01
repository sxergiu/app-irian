package com.app.backend.web.lib.DTO.booking;

import com.app.backend.web.lib.DTO.group.NamedGroupResponse;
import com.app.backend.web.lib.DTO.room.RoomResponse;
import com.app.backend.web.lib.DTO.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class BookingDetailsResponse {

    private Long id;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private NamedGroupResponse group;
    private UserResponse user;
    private RoomResponse room;
}
