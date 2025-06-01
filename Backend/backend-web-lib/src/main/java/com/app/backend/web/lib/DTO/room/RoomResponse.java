package com.app.backend.web.lib.DTO.room;

import com.app.backend.domain.room.GeoLocation;
import java.util.Set;

public class RoomResponse {

    private Long id;
    private String name;
    private String location;
    private int capacity;
    private Set<String> amenities;
    private GeoLocation locationGeo;

    public RoomResponse(Long id, String name, String location, int capacity, Set<String> amenities, GeoLocation locationGeo) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.amenities = amenities;
        this.locationGeo = locationGeo;
    }

    public RoomResponse() {

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

    public GeoLocation getLocationGeo() {
        return locationGeo;
    }

    public void setLocationGeo(GeoLocation locationGeo) {
        this.locationGeo = locationGeo;
    }
}