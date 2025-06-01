package com.app.backend.domain.booking;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.time.LocalTime;
import java.util.Objects;

@Embeddable
public class TimeInterval {

    @Column(name = "start_time", nullable = false)
    @JsonFormat(pattern = "HH:mm")
    private final LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    @JsonFormat(pattern = "HH:mm")
    private final LocalTime endTime;

    protected TimeInterval() {
        this.startTime = null;
        this.endTime = null;
    }

    public TimeInterval(LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public LocalTime setStartTime(LocalTime startTime) {
        return startTime;
    }

    public LocalTime setEndTime(LocalTime endTime) {
        return endTime;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        TimeInterval that = (TimeInterval) o;
        return Objects.equals(startTime, that.startTime) && Objects.equals(endTime, that.endTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(startTime, endTime);
    }

    @Override
    public String toString() {
        return "TimeInterval{" +
                "startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }
}
