package com.app.backend.web.lib.controllers.group;

import com.app.backend.domain.group.NamedGroup;
import com.app.backend.service.api.INamedGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

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
    public ResponseEntity<Set<NamedGroup>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }
}
