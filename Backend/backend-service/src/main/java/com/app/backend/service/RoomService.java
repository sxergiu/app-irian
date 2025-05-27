package com.app.backend.service;

import com.app.backend.domain.room.GeoLocation;
import com.app.backend.domain.room.Room;
import com.app.backend.domain.room.RoomJPARepository;
import com.app.backend.service.api.IRoomService;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class RoomService implements IRoomService {

    private final RoomJPARepository roomRepository;

    @PostConstruct
    void init() {
        if (roomRepository.count() == 0) {
            if (roomRepository.count() == 0) {
                Room room1 = new Room();
                room1.setName("Ocean View Meeting Room");
                room1.setLocation("San Francisco");
                room1.setCapacity(12);
                room1.setAmenities(Set.of("Projector", "Whiteboard", "Wi-Fi"));
                room1.setCoordinates(new GeoLocation(37.7749, -122.4194));

                Room room2 = new Room();
                room2.setName("Downtown Conference Hall");
                room2.setLocation("New York");
                room2.setCapacity(25);
                room2.setAmenities(Set.of("TV", "Microphone", "Coffee Machine"));
                room2.setCoordinates(new GeoLocation(40.7128, -74.0060));

                Room room3 = new Room();
                room3.setName("Creative Studio");
                room3.setLocation("Berlin");
                room3.setCapacity(8);
                room3.setAmenities(Set.of("Whiteboard", "Sound System"));
                room3.setCoordinates(new GeoLocation(52.5200, 13.4050));

                Room room4 = new Room();
                room4.setName("Skyline Boardroom");
                room4.setLocation("Chicago");
                room4.setCapacity(15);
                room4.setAmenities(Set.of("Projector", "Conference Phone", "Wi-Fi"));
                room4.setCoordinates(new GeoLocation(41.8781, -87.6298));

                Room room5 = new Room();
                room5.setName("Innovation Hub");
                room5.setLocation("London");
                room5.setCapacity(10);
                room5.setAmenities(Set.of("Smart TV", "Whiteboard", "Coffee Machine"));
                room5.setCoordinates(new GeoLocation(51.5074, -0.1278));

                Room room6 = new Room();
                room6.setName("Tech Talk Space");
                room6.setLocation("Tokyo");
                room6.setCapacity(20);
                room6.setAmenities(Set.of("Microphone", "Projector", "Wi-Fi", "Sound System"));
                room6.setCoordinates(new GeoLocation(35.6895, 139.6917));

                Room room7 = new Room();
                room7.setName("Mountain View Lab");
                room7.setLocation("Zurich");
                room7.setCapacity(6);
                room7.setAmenities(Set.of("Whiteboard", "High-Speed Wi-Fi"));
                room7.setCoordinates(new GeoLocation(47.3769, 8.5417));

                Room room8 = new Room();
                room8.setName("Lakeside Meeting Spot");
                room8.setLocation("Toronto");
                room8.setCapacity(18);
                room8.setAmenities(Set.of("TV", "Coffee Machine", "Wi-Fi", "Projector"));
                room8.setCoordinates(new GeoLocation(43.6532, -79.3832));


                roomRepository.saveAll(List.of(room1, room2, room3, room4, room5, room6, room7, room8));

                System.out.println("Seeded sample rooms");
            }
        }
    }

    public RoomService(RoomJPARepository roomRepository) {
        this.roomRepository = roomRepository;
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
}
