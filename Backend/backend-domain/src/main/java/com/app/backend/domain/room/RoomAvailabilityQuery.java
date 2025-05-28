package com.app.backend.domain.room;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

public record RoomAvailabilityQuery(int minCapacity, Set<String> requiredAmenities, LocalDate date, LocalTime startTime,
                                    LocalTime endTime) {

    @Override
    public String toString() {
        return "RoomAvailabilityQuery{" +
                "capacity=" + minCapacity +
                ", amenities=" + requiredAmenities +
                ", date=" + date +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }

}
