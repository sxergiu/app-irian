package com.app.backend.web.lib.DTO.availability;

import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;
import java.util.Set;

@Data
public class RoomAvailabilityRangeRequest {

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private Integer minCapacity;

    private Set<String> requiredAmenities;
}