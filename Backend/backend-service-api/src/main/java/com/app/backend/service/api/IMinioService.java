package com.app.backend.service.api;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;

import java.io.InputStream;
import java.util.List;

public interface IMinioService {

    String getPresignedUrl(String fileName) throws Exception;
    ResponseEntity<InputStreamResource> downloadFile(String file) throws Exception;
    List<String> listFiles() throws Exception;
    String generateCsvFromBookings() throws Exception;
    void uploadFile(String bucket, String objectName, InputStream stream, long size, String contentType) throws Exception;
}
