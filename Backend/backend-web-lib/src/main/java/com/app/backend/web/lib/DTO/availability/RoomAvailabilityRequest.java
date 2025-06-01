package com.app.backend.web.lib.DTO.availability;

import jakarta.annotation.Nullable;

import java.time.LocalDate;

import java.util.Set;



public class RoomAvailabilityRequest {

    @Nullable
    private LocalDate date;

    @Nullable
    private Integer minCapacity;

    @Nullable
    private Set<String> requiredAmenities;

    public RoomAvailabilityRequest(@Nullable LocalDate date, @Nullable Integer minCapacity, @Nullable Set<String> requiredAmenities) {
        this.date = date;
        this.minCapacity = minCapacity;
        this.requiredAmenities = requiredAmenities;
    }

    @Nullable
    public LocalDate getDate() {
        return date;
    }

    public void setDate(@Nullable LocalDate date) {
        this.date = date;
    }

    @Nullable
    public Integer getMinCapacity() {
        return minCapacity;
    }

    public void setMinCapacity(@Nullable Integer minCapacity) {
        this.minCapacity = minCapacity;
    }

    @Nullable
    public Set<String> getRequiredAmenities() {
        return requiredAmenities;
    }

    public void setRequiredAmenities(@Nullable Set<String> requiredAmenities) {
        this.requiredAmenities = requiredAmenities;
    }
}
