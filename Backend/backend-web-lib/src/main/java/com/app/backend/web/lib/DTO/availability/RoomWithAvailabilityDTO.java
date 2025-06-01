package com.app.backend.web.lib.DTO.availability;


import java.util.List;
import java.util.Set;

public class RoomWithAvailabilityDTO {

    private Long id;
    private String name;
    private String location;
    private int capacity;
    private Set<String> amenities;
    private List<TimeIntervalDTO> availableSlots;

    public RoomWithAvailabilityDTO(Long id, String name, String location, int capacity, Set<String> amenities, List<TimeIntervalDTO> availableSlots) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.amenities = amenities;
        this.availableSlots = availableSlots;
    }

    public RoomWithAvailabilityDTO() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public Set<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(Set<String> amenities) {
        this.amenities = amenities;
    }

    public List<TimeIntervalDTO> getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(List<TimeIntervalDTO> availableSlots) {
        this.availableSlots = availableSlots;
    }
}


