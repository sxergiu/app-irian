package com.app.backend.web.lib.controllers.export;

import com.app.backend.domain.user.AppUser;
import com.app.backend.service.api.IExportService;

import org.springframework.http.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Path;

@RestController
@RequestMapping("api/booking")
public class ExportController {

    private final IExportService bookingExportService;

    public ExportController(IExportService bookingExportService) {
        this.bookingExportService = bookingExportService;
    }

    @GetMapping("/export")
    public ResponseEntity<Resource> downloadExport(@AuthenticationPrincipal AppUser user) throws IOException {

        Path filePath;

        if (user.isAdmin()) {

            filePath = bookingExportService.getExportFileForAllUsers();

            if (filePath == null) {
                filePath = bookingExportService.generateExportForAllUsers();
            }

        } else {

            filePath = bookingExportService.getExportFileForUser(user.getEmail());

            if (filePath == null) {
                filePath = bookingExportService.generateExportForUser(user.getEmail());
            }
        }

        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(resource);
    }


}
