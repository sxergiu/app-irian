package com.app.backend.web.lib.controllers.room;

import com.app.backend.domain.room.Room;
import com.app.backend.domain.room.RoomAvailabilityQuery;
import com.app.backend.service.api.IRoomService;
import com.app.backend.web.lib.DTO.room.RoomAvailabilityRequest;
import com.app.backend.web.lib.DTO.room.RoomAvailabilityResponse;
import com.app.backend.web.lib.DTO.room.RoomRequest;
import com.app.backend.web.lib.DTO.room.RoomResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
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

        try {
            Room room = roomMapper.toEntity(dto);
            Room savedRoom = roomService.createRoom(room);
            return new ResponseEntity<>(roomMapper.toDTO(savedRoom), HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id, @RequestBody RoomRequest dto) {

        Room updatedRoom = roomMapper.toEntity(dto);
        updatedRoom.setId(id);
        Room savedRoom = roomService.updateRoom(id, updatedRoom);
        return ResponseEntity.ok(roomMapper.toDTO(savedRoom));
    }


    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoom(@PathVariable Long id) {
        Room room = roomService.getRoom(id);
        return ResponseEntity.ok(roomMapper.toDTO(room));
    }

    @GetMapping
    public ResponseEntity<Set<RoomResponse>> getAllRooms() {
        Set<RoomResponse> result =
                new HashSet<>(roomService.getAllRooms().stream()
                .map(roomMapper::toDTO)
                .toList());
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/available")
    public ResponseEntity<List<RoomAvailabilityResponse>> getAvailableRooms(
            @RequestBody RoomAvailabilityRequest request) {

        try {

            if( request.getMinCapacity() == null ) {
                request.setMinCapacity(0);
            }

            if( request.getRequiredAmenities() == null ) {
                request.setRequiredAmenities(new HashSet<>());
            }

            List<Room> rooms = roomService.findAvailableRooms(new RoomAvailabilityQuery(
                    request.getMinCapacity(),
                    request.getRequiredAmenities(),
                    request.getDate(),
                    request.getStartTime(),
                    request.getEndTime()
            ));

            List<RoomAvailabilityResponse> response = rooms.stream()
                    .map(this.roomMapper::toRoomAvailabilityResponse)
                    .toList();

            return ResponseEntity.ok(response);
        }catch ( Exception e ) {

            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/amenities")
    public Set<String> getAllAvailableAmenities() {
        return roomService.findAllAvailableAmenities();
    }

}
