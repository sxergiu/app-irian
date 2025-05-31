package com.app.backend.web.lib.controllers.room;

import com.app.backend.domain.room.Room;
import com.app.backend.domain.room.RoomWithAvailability;
import com.app.backend.web.lib.DTO.room.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

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

    public RoomWithAvailabilityDTO toRoomWithAvailabilityDTO(RoomWithAvailability room) {
        RoomWithAvailabilityDTO dto = new RoomWithAvailabilityDTO();

        dto.setId(room.id());
        dto.setName(room.name());
        dto.setLocation(room.location());
        dto.setCapacity(room.capacity());
        dto.setAmenities(room.amenities());

        if (room.availableSlots() != null) {
            List<TimeIntervalDTO> slots = room.availableSlots().stream()
                    .map(slot -> new TimeIntervalDTO(
                            slot.getStartTime().toString(),
                            slot.getEndTime().toString()
                    ))
                    .collect(Collectors.toList());

            dto.setAvailableSlots(slots);
        }

        return dto;
    }


}