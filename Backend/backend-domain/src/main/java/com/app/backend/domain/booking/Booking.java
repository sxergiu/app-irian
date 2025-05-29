package com.app.backend.domain.booking;

import com.app.backend.domain.group.NamedGroup;
import com.app.backend.domain.room.Room;
import com.app.backend.domain.user.AppUser;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Room room;

    private LocalDate date;

    @Embedded
    private TimeInterval time;

    @ManyToOne(optional = false)
    private AppUser user;

    @ManyToOne(optional = false)
    private NamedGroup namedGroup;

    public Booking(Long id, Room room, LocalDate date, TimeInterval time, AppUser user, NamedGroup namedGroup) {
        this.id = id;
        this.room = room;
        this.date = date;
        this.time = time;
        this.user = user;
        this.namedGroup = namedGroup;
    }

    public Booking() {

    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TimeInterval getTime() {
        return time;
    }

    public void setTime(TimeInterval time) {
        this.time = time;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public NamedGroup getNamedGroup() {
        return namedGroup;
    }

    public void setNamedGroup(NamedGroup namedGroup) {
        this.namedGroup = namedGroup;
    }
}

