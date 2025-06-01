package com.app.backend.service.api;

import com.app.backend.domain.room.Room;
import com.app.backend.domain.availability.RoomAvailabilityQuery;
import com.app.backend.domain.availability.RoomWithAvailability;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

public interface IRoomService {

    Room createRoom(Room room);
    Room updateRoom(Long id, Room updatedRoom);
    Room getRoom(Long id);
    Set<Room> getAllRooms();
    void deleteRoom(Long id);
    Optional<Room> findById(Long id);
    List<RoomWithAvailability> findAvailableRooms(RoomAvailabilityQuery roomFilter);
    Set<String> findAllAvailableAmenities();
    Map<LocalDate, List<RoomWithAvailability>> getRoomAvailabilityRange(LocalDate startDate, LocalDate endDate, Integer minCapacity, Set<String> requiredAmenities);
}
