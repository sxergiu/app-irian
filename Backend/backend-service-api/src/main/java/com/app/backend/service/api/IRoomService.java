package com.app.backend.service.api;

import com.app.backend.domain.room.Room;
import com.app.backend.domain.room.RoomAvailabilityQuery;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IRoomService {

    Room createRoom(Room room);
    Room updateRoom(Long id, Room updatedRoom);
    Room getRoom(Long id);
    Set<Room> getAllRooms();
    void deleteRoom(Long id);
    Optional<Room> findById(Long id);
    List<Room> findAvailableRooms(RoomAvailabilityQuery roomFilter);

}
