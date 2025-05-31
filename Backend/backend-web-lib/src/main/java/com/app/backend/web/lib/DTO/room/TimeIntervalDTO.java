package com.app.backend.web.lib.DTO.room;

import lombok.Data;

@Data
public class TimeIntervalDTO {
    private String startTime;
    private String endTime;

    public TimeIntervalDTO(String startTime, String endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }

}