package com.app.backend.web.lib.DTO.room;

import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class RoomWithAvailabilityDTO {
    private Long id;
    private String name;
    private String location;
    private int capacity;
    private Set<String> amenities;
    private List<TimeIntervalDTO> availableSlots;
}


