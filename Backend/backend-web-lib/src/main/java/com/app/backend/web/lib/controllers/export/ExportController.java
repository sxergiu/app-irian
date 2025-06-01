package com.app.backend.web.lib.controllers.export;

import com.app.backend.service.api.IMinioService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("api/booking/export")
public class ExportController {

    private final IMinioService minioService;

    public ExportController(IMinioService minioService) {
        this.minioService = minioService;
    }

    @GetMapping("/download")
    public ResponseEntity<InputStreamResource> download(@RequestParam String file) throws Exception {
        return minioService.downloadFile(file);
    }

    @GetMapping("/url")
    public String getPresignedDownloadUrl(@RequestParam String fileName) throws Exception {
        return minioService.getPresignedUrl(fileName);
    }

    @GetMapping("/list")
    public List<String> listFiles() throws Exception {
        return minioService.listFiles();
    }


    @PostMapping
    public ResponseEntity<String> exportBookings() throws Exception {

        String csvContent = minioService.generateCsvFromBookings();

        String fileName = "bookings-export-" + System.currentTimeMillis() + ".csv";

        try (InputStream stream = new ByteArrayInputStream(csvContent.getBytes(StandardCharsets.UTF_8))) {
            minioService.uploadFile("exports", fileName, stream, csvContent.length(), "text/csv");
        }

        return ResponseEntity.ok(fileName);
    }

}
