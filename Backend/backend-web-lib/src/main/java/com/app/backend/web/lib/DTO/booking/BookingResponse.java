package com.app.backend.web.lib.DTO.booking;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingResponse {

    private Long id;

    private Long roomId;
    private String roomName;
    private String roomLocation;

    private Long namedGroupId;
    private String namedGroupName;
    private Integer namedGroupSize;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private Long userId;
    private String userName;

    public BookingResponse() {

    }

    public BookingResponse(Long id, Long roomId, String roomName, String roomLocation,
                           Long namedGroupId, String namedGroupName,
                           Integer namedGroupSize, LocalDate date,
                           LocalTime startTime, LocalTime endTime,
                           Long userId, String userName) {
        this.id = id;
        this.roomId = roomId;
        this.roomName = roomName;
        this.roomLocation = roomLocation;
        this.namedGroupId = namedGroupId;
        this.namedGroupName = namedGroupName;
        this.namedGroupSize = namedGroupSize;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.userId = userId;
        this.userName = userName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getRoomLocation() {
        return roomLocation;
    }

    public void setRoomLocation(String roomLocation) {
        this.roomLocation = roomLocation;
    }

    public Long getNamedGroupId() {
        return namedGroupId;
    }

    public void setNamedGroupId(Long namedGroupId) {
        this.namedGroupId = namedGroupId;
    }

    public String getNamedGroupName() {
        return namedGroupName;
    }

    public void setNamedGroupName(String namedGroupName) {
        this.namedGroupName = namedGroupName;
    }

    public Integer getNamedGroupSize() {
        return namedGroupSize;
    }

    public void setNamedGroupSize(Integer namedGroupSize) {
        this.namedGroupSize = namedGroupSize;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
