package com.app.backend.web.lib.DTO.booking;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingResponse {

    private Long id;

    private Long roomId;
    private String roomName;
    private String roomLocation;  // e.g. address or city

    private Long namedGroupId;
    private String namedGroupName;
    private Integer namedGroupSize;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private Long userId;
    private String userName;
}
