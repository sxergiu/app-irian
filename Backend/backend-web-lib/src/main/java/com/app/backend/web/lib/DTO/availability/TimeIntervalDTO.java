package com.app.backend.web.lib.DTO.availability;

import java.time.LocalTime;

public class TimeIntervalDTO {

    private LocalTime startTime;
    private LocalTime endTime;


    public TimeIntervalDTO(LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}