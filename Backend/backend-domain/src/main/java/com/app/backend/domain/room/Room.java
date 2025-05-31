package com.app.backend.domain.room;

import com.app.backend.domain.booking.TimeInterval;
import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    String name;

    @Embedded
    private GeoLocation coordinates;

    private String location;

    @ElementCollection
    private Set<String> amenities = new HashSet<>();

    private Integer capacity;

    @Column(nullable = false)
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "room_availability", joinColumns = @JoinColumn(name = "room_id"))
    private List<TimeInterval> availableSlots =
            new ArrayList<>(List.of(new TimeInterval(LocalTime.of(7, 0), LocalTime.of(21, 0))));

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

    public GeoLocation getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(GeoLocation coordinates) {
        this.coordinates = coordinates;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(Set<String> amenities) {
        this.amenities = amenities;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public List<TimeInterval> getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(List<TimeInterval> availableSlots) {
        this.availableSlots = availableSlots;
    }

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", coordinates=" + coordinates +
                ", location='" + location + '\'' +
                ", amenities=" + amenities +
                ", capacity=" + capacity +
                '}';
    }
}
