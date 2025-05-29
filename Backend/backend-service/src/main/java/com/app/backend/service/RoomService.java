package com.app.backend.service;

import com.app.backend.domain.booking.BookingJPARepository;
import com.app.backend.domain.room.Room;
import com.app.backend.domain.room.RoomAvailabilityQuery;
import com.app.backend.domain.room.RoomJPARepository;
import com.app.backend.service.api.IRoomService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class RoomService implements IRoomService {

    private final RoomJPARepository roomRepository;
    private final BookingJPARepository bookingRepository;


    public RoomService(RoomJPARepository roomRepository, BookingJPARepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public Room createRoom(Room room) {
        if (roomRepository.existsByName(room.getName())) {
            throw new RuntimeException("Room name must be unique");
        }
        return roomRepository.save(room);
    }

    @Transactional
    @Override
    public Room updateRoom(Long id, Room updatedRoom) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getName().equals(updatedRoom.getName()) && roomRepository.existsByName(updatedRoom.getName())) {
            throw new RuntimeException("Room name must be unique");
        }

        room.setName(updatedRoom.getName());
        room.setLocation(updatedRoom.getLocation());
        room.setCapacity(updatedRoom.getCapacity());
        room.setAmenities(updatedRoom.getAmenities());
        room.setCoordinates(updatedRoom.getCoordinates());

        return roomRepository.save(room);
    }

    @Override
    public Room getRoom(Long id) {
        return roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    @Override
    public Set<Room> getAllRooms() {
        return new HashSet<>(roomRepository.findAll());
    }

    @Override
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found");
        }
        roomRepository.deleteById(id);
    }

    @Override
    public Optional<Room> findById(Long id) {
        return roomRepository.findById(id);
    }

    @Override
    public List<Room> findAvailableRooms(RoomAvailabilityQuery query) {

        System.out.println("Filtering by: " + query.requiredAmenities());

        List<Room> allMatchingRooms = roomRepository.findByCapacityGreaterThanEqualAndAmenitiesContainingAll(
                query.minCapacity(), query.requiredAmenities()
        );


        return allMatchingRooms.stream()
                .filter(room -> isRoomAvailable(room, query.date(), query.startTime(), query.endTime()))
                .toList();
    }


    private boolean isRoomAvailable(Room room, LocalDate date, LocalTime start, LocalTime end) {
        return bookingRepository.findOverlappingBookings(room.getId(), date, start, end).isEmpty();
    }

    public Set<String> findAllAvailableAmenities() {
        return roomRepository.findDistinctAmenities();
    }
}
