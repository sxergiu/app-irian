package com.app.backend.web.lib.DTO.group;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NamedGroupResponse {
    private Long id;
    private String name;
    private int size;
}
