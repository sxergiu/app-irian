package com.app.backend.web.lib.DTO.room;

import com.app.backend.domain.booking.TimeInterval;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class RoomAvailabilityResponse {

    private Long id;
    private String name;
    private String location;
    private int capacity;
    private Set<String> amenities;
    List<TimeInterval> availableSlots;
}
