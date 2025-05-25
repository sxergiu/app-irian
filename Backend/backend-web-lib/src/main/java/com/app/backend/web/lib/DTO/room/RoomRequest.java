package com.app.backend.web.lib.DTO.room;

import com.app.backend.domain.room.GeoLocation;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class RoomRequest {
    private String name;
    private String location;
    private int capacity;
    private Set<String> amenities;
    private GeoLocation locationGeo;
}