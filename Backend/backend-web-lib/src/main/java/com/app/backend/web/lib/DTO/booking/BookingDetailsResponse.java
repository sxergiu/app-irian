package com.app.backend.web.lib.DTO.booking;

import com.app.backend.web.lib.DTO.group.NamedGroupResponse;
import com.app.backend.web.lib.DTO.room.RoomResponse;
import com.app.backend.web.lib.DTO.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingDetailsResponse {

    private Long id;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private NamedGroupResponse group;
    private UserResponse user;
    private RoomResponse room;

    public BookingDetailsResponse(Long id, LocalDate date, LocalTime startTime, LocalTime endTime, NamedGroupResponse group, UserResponse user, RoomResponse room) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.group = group;
        this.user = user;
        this.room = room;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public NamedGroupResponse getGroup() {
        return group;
    }

    public void setGroup(NamedGroupResponse group) {
        this.group = group;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public RoomResponse getRoom() {
        return room;
    }

    public void setRoom(RoomResponse room) {
        this.room = room;
    }
}
