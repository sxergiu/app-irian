package com.app.backend.service;

import com.app.backend.domain.booking.Booking;
import com.app.backend.domain.booking.BookingJPARepository;
import com.app.backend.domain.booking.TimeInterval;
import com.app.backend.domain.room.Room;
import com.app.backend.domain.room.RoomAvailabilityQuery;
import com.app.backend.domain.room.RoomJPARepository;
import com.app.backend.domain.room.RoomWithAvailability;
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
    public List<RoomWithAvailability> findAvailableRooms(RoomAvailabilityQuery query) {
        List<Room> rooms = roomRepository.findByCapacityGreaterThanEqualAndAmenitiesContainingAll(
                query.minCapacity(), query.requiredAmenities()
        );

        return rooms.stream()
                .map(room -> convertToRoomWithAvailability(room, query.date()))
                .toList();
    }

    private RoomWithAvailability getRoomWithFreeSlots(RoomWithAvailability room, LocalDate date) {

        List<TimeInterval> roomAvailability = room.availableSlots().stream()
                .map(slot -> new TimeInterval(slot.getStartTime(), slot.getEndTime()))
                .collect(Collectors.toList());

        List<Booking> bookings = bookingRepository.findByRoomIdAndDate(room.id(), date);
        List<TimeInterval> bookingIntervals = bookings.stream()
                .map(Booking::getTime)
                .toList();

        List<TimeInterval> freeSlots = subtractAll(roomAvailability, bookingIntervals);

        return new RoomWithAvailability(
                room.id(),
                room.name(),
                room.location(),
                room.capacity(),
                room.amenities(),
                freeSlots
        );
    }

    public Set<String> findAllAvailableAmenities() {
        return roomRepository.findDistinctAmenities();
    }

    public List<TimeInterval> subtractInterval(List<TimeInterval> slots, TimeInterval toSubtract) {

        List<TimeInterval> updated = new ArrayList<>();

        for (TimeInterval slot : slots) {
            if (!toSubtract.getStartTime().isBefore(slot.getEndTime()) ||
                    !toSubtract.getEndTime().isAfter(slot.getStartTime())) {
                updated.add(slot); // no overlap (before or after, even if touching)
            }
            else {
                if (toSubtract.getStartTime().isAfter(slot.getStartTime())) {
                    updated.add(new TimeInterval(slot.getStartTime(), toSubtract.getStartTime()));
                }
                if (toSubtract.getEndTime().isBefore(slot.getEndTime())) {
                    updated.add(new TimeInterval(toSubtract.getEndTime(), slot.getEndTime()));
                }
            }
        }

        System.out.println("Subtracting: " + toSubtract);
        System.out.println("From slots: " + slots);
        System.out.println("Result: " + updated);

        return updated;
    }

    private List<TimeInterval> subtractAll(List<TimeInterval> base, List<TimeInterval> toSubtractList) {

        List<TimeInterval> result = new ArrayList<>(base);
        for (TimeInterval interval : toSubtractList) {
            result = subtractInterval(result, interval);
        }
        return result;
    }

    @Override
    public Map<LocalDate, List<RoomWithAvailability>> getRoomAvailabilityRange(
            LocalDate start, LocalDate end, Integer minCapacity, Set<String> requiredAmenities) {

        Map<LocalDate, List<RoomWithAvailability>> availabilityByDate = new LinkedHashMap<>();

        List<Room> matchingRooms = roomRepository.findByCapacityGreaterThanEqualAndAmenitiesContainingAll(
                minCapacity, requiredAmenities
        );

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            final LocalDate currentDate = date;

            List<RoomWithAvailability> roomsForDate = matchingRooms.stream()
                    .map(room -> createAvailableRoomForDate(room, currentDate))
                    .toList();

            availabilityByDate.put(currentDate, roomsForDate);
        }

        return availabilityByDate;
    }

    private RoomWithAvailability createAvailableRoomForDate(Room room, LocalDate date) {

        RoomWithAvailability copy = convertToRoomWithAvailability(room,date);

        return getRoomWithFreeSlots(copy, date);
    }

    private RoomWithAvailability convertToRoomWithAvailability(Room room, LocalDate date) {
        List<TimeInterval> baseAvailability = List.of(new TimeInterval(LocalTime.of(7, 0), LocalTime.of(21, 0)));

        List<Booking> bookings = bookingRepository.findByRoomIdAndDate(room.getId(), date);
        List<TimeInterval> bookedIntervals = bookings.stream()
                .map(Booking::getTime)
                .toList();

        List<TimeInterval> freeSlots = subtractAll(baseAvailability, bookedIntervals);

        return new RoomWithAvailability(room, freeSlots);
    }


}
