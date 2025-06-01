package com.app.backend.web.lib.DTO.availability;

import lombok.Data;

import java.time.LocalTime;

@Data
public class TimeIntervalDTO {

    private LocalTime startTime;
    private LocalTime endTime;

    public TimeIntervalDTO(LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

}