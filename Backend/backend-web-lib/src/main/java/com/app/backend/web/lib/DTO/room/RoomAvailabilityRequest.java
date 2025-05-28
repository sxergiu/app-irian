package com.app.backend.web.lib.DTO.room;

import jakarta.annotation.Nullable;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;


@Data
public class RoomAvailabilityRequest {

    @Nullable
    private LocalDate date;

    @Nullable
    private LocalTime startTime;

    @Nullable
    private LocalTime endTime;

    @Nullable
    private Integer minCapacity;

    @Nullable
    private Set<String> requiredAmenities;
}
