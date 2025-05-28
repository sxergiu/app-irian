package com.app.backend.web.lib.DTO.booking;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {

    private Long roomId;

    private Long namedGroupId;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;
}
