package com.app.backend.service;

import com.app.backend.domain.booking.Booking;
import com.app.backend.domain.booking.BookingJPARepository;
import com.app.backend.domain.booking.TimeInterval;
import com.app.backend.domain.room.Room;
import com.app.backend.domain.room.RoomAvailabilityQuery;
import com.app.backend.domain.room.RoomJPARepository;
import com.app.backend.service.api.IRoomService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

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

        room.setAvailableSlots(List.of(new TimeInterval(
                LocalTime.of(7, 0),
                LocalTime.of(21, 0)
        )));


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

        System.out.println("Filtering: " +query.date());

        return roomRepository.findWithAvailability(query.minCapacity())
                .stream()
                .filter(room -> room.getAmenities().containsAll(query.requiredAmenities()))
                .map(room -> getRoomWithFreeSlots(room, query.date()))
                .collect(Collectors.toList());
    }

    private Room getRoomWithFreeSlots(Room room, LocalDate date) {

        List<TimeInterval> roomAvailability = new ArrayList<>(room.getAvailableSlots());

        List<Booking> bookings = bookingRepository.findByRoomIdAndDate(room.getId(), date);

        List<TimeInterval> bookingIntervals = bookings.stream()
                .map(Booking::getTime)
                .toList();

        List<TimeInterval> freeSlots = subtractAll(roomAvailability, bookingIntervals);

        room.setAvailableSlots(freeSlots);

        return room;
    }

    private boolean isRoomAvailable(Room room, LocalDate date) {
        return bookingRepository.findOverlappingBookings(room.getId(), date).isEmpty();
    }

    public Set<String> findAllAvailableAmenities() {
        return roomRepository.findDistinctAmenities();
    }

    private List<TimeInterval> subtractInterval(List<TimeInterval> slots, TimeInterval toSubtract) {

        List<TimeInterval> updated = new ArrayList<>();

        for (TimeInterval slot : slots) {
            if (toSubtract.getEndTime().isBefore(slot.getStartTime()) ||
                    toSubtract.getStartTime().isAfter(slot.getEndTime())) {
                updated.add(slot); // no overlap
            } else {
                if (toSubtract.getStartTime().isAfter(slot.getStartTime())) {
                    updated.add(new TimeInterval(slot.getStartTime(), toSubtract.getStartTime()));
                }
                if (toSubtract.getEndTime().isBefore(slot.getEndTime())) {
                    updated.add(new TimeInterval(toSubtract.getEndTime(), slot.getEndTime()));
                }
            }
        }

        return updated;
    }

    private List<TimeInterval> subtractAll(List<TimeInterval> base, List<TimeInterval> toSubtractList) {

        List<TimeInterval> result = new ArrayList<>(base);
        for (TimeInterval interval : toSubtractList) {
            result = subtractInterval(result, interval);
        }
        return result;
    }


}
