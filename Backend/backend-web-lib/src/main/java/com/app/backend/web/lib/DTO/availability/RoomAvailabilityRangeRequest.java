package com.app.backend.web.lib.DTO.availability;

import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;
import java.util.Set;

public class RoomAvailabilityRangeRequest {

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private Integer minCapacity;

    private Set<String> requiredAmenities;

    public RoomAvailabilityRangeRequest(LocalDate startDate, LocalDate endDate, Integer minCapacity, Set<String> requiredAmenities) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.minCapacity = minCapacity;
        this.requiredAmenities = requiredAmenities;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getMinCapacity() {
        return minCapacity;
    }

    public void setMinCapacity(Integer minCapacity) {
        this.minCapacity = minCapacity;
    }

    public Set<String> getRequiredAmenities() {
        return requiredAmenities;
    }

    public void setRequiredAmenities(Set<String> requiredAmenities) {
        this.requiredAmenities = requiredAmenities;
    }
}