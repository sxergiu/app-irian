package com.app.backend.web.lib.controllers.group;

import com.app.backend.domain.group.NamedGroup;
import com.app.backend.service.api.INamedGroupService;
import com.app.backend.web.lib.DTO.group.NamedGroupResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/group")
public class NamedGroupController {

    @Autowired
    private INamedGroupService groupService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadCSV(@RequestParam("file") MultipartFile file) {

        try {
            groupService.importGroupsFromCSV(file);
            return ResponseEntity.ok("Groups imported successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to import: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Set<NamedGroupResponse>> getAllGroups() {

        Set<NamedGroup>namedGroups = groupService.getAllGroups();

        return ResponseEntity.ok(namedGroups.stream()
                .map(group -> new NamedGroupResponse(group.getId(), group.getName(), group.getNumberOfPeople()))
                .collect(Collectors.toSet())
        );
    }
}
