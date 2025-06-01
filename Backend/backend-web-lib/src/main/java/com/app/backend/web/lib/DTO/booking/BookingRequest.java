package com.app.backend.web.lib.DTO.booking;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequest {

    private Long roomId;

    private Long namedGroupId;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    public BookingRequest(Long roomId, Long namedGroupId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        this.roomId = roomId;
        this.namedGroupId = namedGroupId;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Long getNamedGroupId() {
        return namedGroupId;
    }

    public void setNamedGroupId(Long namedGroupId) {
        this.namedGroupId = namedGroupId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
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
