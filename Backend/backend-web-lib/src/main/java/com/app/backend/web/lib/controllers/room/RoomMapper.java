package com.app.backend.web.lib.controllers.room;

import com.app.backend.domain.room.Room;
import com.app.backend.web.lib.DTO.room.RoomAvailabilityRequest;
import com.app.backend.web.lib.DTO.room.RoomAvailabilityResponse;
import com.app.backend.web.lib.DTO.room.RoomRequest;
import com.app.backend.web.lib.DTO.room.RoomResponse;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public Room toEntity(RoomRequest dto) {
        Room room = new Room();

        room.setName(dto.getName());
        room.setLocation(dto.getLocation());
        room.setCapacity(dto.getCapacity());
        room.setAmenities(dto.getAmenities());
        room.setCoordinates(dto.getLocationGeo());

        return room;
    }

    public RoomResponse toDTO(Room room) {
        RoomResponse dto = new RoomResponse();

        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setLocation(room.getLocation());
        dto.setCapacity(room.getCapacity());
        dto.setAmenities(room.getAmenities());
        dto.setLocationGeo(room.getCoordinates());

        return dto;
    }

    public RoomAvailabilityResponse toRoomAvailabilityResponse(Room room) {

        RoomAvailabilityResponse dto = new RoomAvailabilityResponse();
        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setLocation(room.getLocation());
        dto.setCapacity(room.getCapacity());
        dto.setAmenities(room.getAmenities());
        dto.setAvailableSlots(room.getAvailableSlots());

        return dto;
    }
}