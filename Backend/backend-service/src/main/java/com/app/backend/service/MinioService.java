package com.app.backend.service;

import com.app.backend.domain.booking.Booking;
import com.app.backend.domain.booking.BookingJPARepository;
import com.app.backend.service.api.IMinioService;
import io.minio.*;
import io.minio.http.Method;
import io.minio.messages.Item;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MinioService implements IMinioService {

    private final MinioClient minioClient;
    private final BookingJPARepository bookingRepository;

    public MinioService(MinioClient minioClient, BookingJPARepository bookingRepository) {
        this.minioClient = minioClient;
        this.bookingRepository = bookingRepository;
    }

    @PostConstruct
    public void init() throws Exception {
        ensureBucketExists("exports");
    }

    public String getPresignedUrl(String fileName) throws Exception {
        return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .method(Method.GET)
                        .bucket("exports")
                        .object(fileName)
                        .expiry(60 * 60)
                        .build()
        );
    }

    public ResponseEntity<InputStreamResource> downloadFile(String file) throws Exception {
        InputStream stream = minioClient.getObject(
                GetObjectArgs.builder().bucket("exports").object(file).build()
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(stream));
    }

    public List<String> listFiles() throws Exception {
        List<String> fileNames = new ArrayList<>();
        Iterable<Result<Item>> results = minioClient.listObjects(
                ListObjectsArgs.builder().bucket("exports").build()
        );

        for (Result<Item> result : results) {
            fileNames.add(result.get().objectName());
        }

        return fileNames;
    }

    @Override
    public String generateCsvFromBookings() throws Exception {
        List<Booking> bookings = bookingRepository.findAll();

        String header = "ID,Room Name,Date,Start Time,End Time,User Name";
        List<String> rows = bookings.stream()
                .map(b -> String.format("%d,%s,%s,%s,%s,%s",
                        b.getId(),
                        escapeCsv(b.getRoom().getName()),
                        b.getDate().toString(),
                        b.getTime().getStartTime().toString(),
                        b.getTime().getEndTime().toString(),
                        escapeCsv(b.getUser().getName())
                ))
                .collect(Collectors.toList());

        return header + "\n" + String.join("\n", rows);
    }

    public void ensureBucketExists(String bucketName) throws Exception {
        boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
        if (!found) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }
    }

    public void uploadFile(String bucket, String objectName, InputStream stream, long size, String contentType) throws Exception {
        minioClient.putObject(
                PutObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectName)
                        .stream(stream, size, -1)
                        .contentType(contentType)
                        .build()
        );
    }

    private String escapeCsv(String field) {
        if (field.contains(",") || field.contains("\"")) {
            field = field.replace("\"", "\"\"");
            return "\"" + field + "\"";
        }
        return field;
    }

}
