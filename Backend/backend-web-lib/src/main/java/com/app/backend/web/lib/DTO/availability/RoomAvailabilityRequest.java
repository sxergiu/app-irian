package com.app.backend.web.lib.DTO.availability;

import jakarta.annotation.Nullable;
import lombok.Data;

import java.time.LocalDate;

import java.util.Set;


@Data
public class RoomAvailabilityRequest {

    @Nullable
    private LocalDate date;

    @Nullable
    private Integer minCapacity;

    @Nullable
    private Set<String> requiredAmenities;
}
