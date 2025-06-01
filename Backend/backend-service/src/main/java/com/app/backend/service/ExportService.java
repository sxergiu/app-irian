package com.app.backend.service;

import com.app.backend.domain.booking.Booking;
import com.app.backend.domain.booking.BookingJPARepository;

import com.app.backend.service.api.IExportService;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ExportService implements IExportService {

    private final BookingJPARepository bookingRepository;
    private final Path exportDir = Paths.get("exports");
    private final MinioClient minioClient;

    public ExportService(BookingJPARepository bookingRepository, MinioClient minioClient) throws IOException {

        this.bookingRepository = bookingRepository;
        this.minioClient = minioClient;

        if (!Files.exists(exportDir)) {
            Files.createDirectories(exportDir);
        }
    }

    @Override
    public Path generateExportForUser(String userEmail) throws IOException {

        List<Booking> bookings = bookingRepository.findByUserEmail(userEmail);

        String filename = "bookings_" + userEmail + ".csv";
        Path filePath = exportDir.resolve(filename);

        try (BufferedWriter writer = Files.newBufferedWriter(filePath);
             CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT
                     .withHeader("Booking ID", "Room Name", "Group Name", "Date", "Time Start", "Time End"))) {

            for (Booking b : bookings) {
                csvPrinter.printRecord(
                        b.getId(),
                        b.getRoom().getName(),
                        b.getNamedGroup().getName(),
                        b.getDate(),
                        b.getTime().getStartTime(),
                        b.getTime().getEndTime()
                );
            }
        }

        return filePath;
    }

    @Override
    public Path getExportFileForUser(String userEmail) {

        String filename = "bookings_" + userEmail.split("@")[0] + ".csv";
        Path filePath = exportDir.resolve(filename);
        return Files.exists(filePath) ? filePath : null;

    }

    @Override
    public Path generateExportForAllUsers() throws IOException {
        List<Booking> bookings = bookingRepository.findAll();

        String filename = "bookings_all.csv";
        Path filePath = exportDir.resolve(filename);

        try (BufferedWriter writer = Files.newBufferedWriter(filePath);
             CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT
                     .withHeader("Booking ID", "User Email", "Room Name", "Group Name", "Date", "Time start", "Time end"))) {

            for (Booking b : bookings) {
                csvPrinter.printRecord(
                        b.getId(),
                        b.getUser().getEmail(),
                        b.getRoom().getName(),
                        b.getNamedGroup().getName(),
                        b.getDate(),
                        b.getTime().getStartTime(),
                        b.getTime().getEndTime()
                );
            }
        }

        return filePath;
    }

    @Override
    public Path getExportFileForAllUsers() {
        Path filePath = exportDir.resolve("bookings_all.csv");
        return Files.exists(filePath) ? filePath : null;
    }

    public void exportUserBookingsToMinio(String userEmail, List<Booking> bookings) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (CSVPrinter csvPrinter = new CSVPrinter(
                new OutputStreamWriter(out, StandardCharsets.UTF_8),
                CSVFormat.DEFAULT.withHeader("Booking ID", "Room", "Group", "Start Date", "End Date"))) {
            for (Booking b : bookings) {
                csvPrinter.printRecord(b.getId(), b.getRoom().getName(), b.getNamedGroup().getName(), b.getDate(), b.getTime());
            }
        }

        try (ByteArrayInputStream in = new ByteArrayInputStream(out.toByteArray())) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket("exports")
                    .object("bookings_" + userEmail + ".csv")
                    .stream(in, out.size(), -1)
                    .contentType("text/csv")
                    .build());
        }
    }

}
