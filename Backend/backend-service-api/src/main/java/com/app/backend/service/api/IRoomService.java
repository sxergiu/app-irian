package com.app.backend.service.api;

import com.app.backend.domain.room.Room;

import java.util.List;
import java.util.Set;

public interface IRoomService {
    Room createRoom(Room room);
    Room updateRoom(Long id, Room updatedRoom);
    Room getRoom(Long id);
    Set<Room> getAllRooms();
    void deleteRoom(Long id);
}
