package com.app.backend.domain.room;

import java.time.LocalDate;
import java.util.Set;

public record RoomAvailabilityQuery(int minCapacity, Set<String> requiredAmenities, LocalDate date) {

    @Override
    public String toString() {
        return "RoomAvailabilityQuery{" +
                "capacity=" + minCapacity +
                ", amenities=" + requiredAmenities +
                ", date=" + date +
                '}';
    }

}
