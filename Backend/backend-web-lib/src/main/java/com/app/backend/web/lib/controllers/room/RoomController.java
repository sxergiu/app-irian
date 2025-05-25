package com.app.backend.web.lib.controllers.room;

import com.app.backend.domain.room.Room;
import com.app.backend.service.api.IRoomService;
import com.app.backend.web.lib.DTO.room.RoomRequest;
import com.app.backend.web.lib.DTO.room.RoomResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("api/room")
public class RoomController {

    private final IRoomService roomService;
    private final RoomMapper roomMapper;

    public RoomController(IRoomService roomService, RoomMapper roomMapper) {
        this.roomService = roomService;
        this.roomMapper = roomMapper;
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@RequestBody RoomRequest dto) {
        Room room = roomMapper.toEntity(dto);
        Room saved = roomService.createRoom(room);
        return new ResponseEntity<>(roomMapper.toDTO(saved), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoom(@PathVariable Long id) {
        Room room = roomService.getRoom(id);
        return ResponseEntity.ok(roomMapper.toDTO(room));
    }

    @GetMapping("getAll")
    public ResponseEntity<Set<RoomResponse>> getAllRooms() {
        Set<RoomResponse> result =
                new HashSet<>(roomService.getAllRooms().stream()
                .map(roomMapper::toDTO)
                .toList());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id, @RequestBody RoomRequest dto) {
        Room updated = roomMapper.toEntity(dto);
        Room saved = roomService.updateRoom(id, updated);
        return ResponseEntity.ok(roomMapper.toDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}
