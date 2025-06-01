package com.app.backend.domain.booking;

import com.app.backend.domain.group.NamedGroup;
import com.app.backend.domain.room.Room;
import com.app.backend.domain.user.AppUser;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Objects;

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
        return new TimeInterval(time.getStartTime(), time.getEndTime());
    }

    public void setTime(TimeInterval time) {
        this.time = new TimeInterval(time.getStartTime(), time.getEndTime());
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

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Booking booking = (Booking) o;
        return Objects.equals(id, booking.id) && Objects.equals(room, booking.room) && Objects.equals(date, booking.date) && Objects.equals(time, booking.time) && Objects.equals(user, booking.user) && Objects.equals(namedGroup, booking.namedGroup);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, room, date, time, user, namedGroup);
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", room=" + room +
                ", date=" + date +
                ", time=" + time +
                ", user=" + user +
                ", namedGroup=" + namedGroup +
                '}';
    }
}

