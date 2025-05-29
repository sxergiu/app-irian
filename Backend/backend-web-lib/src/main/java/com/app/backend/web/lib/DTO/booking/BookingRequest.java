package com.app.backend.web.lib.DTO.booking;

import com.app.backend.domain.booking.TimeInterval;
import lombok.Data;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {

    private Long roomId;

    private Long namedGroupId;

    private LocalDate date;

    private TimeInterval time;
}
