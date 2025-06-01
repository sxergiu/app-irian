package com.app.backend.service.api;

import java.io.IOException;
import java.nio.file.Path;

public interface IExportService {

    Path generateExportForUser(String userEmail) throws IOException;
    Path getExportFileForUser(String userEmail);

    Path generateExportForAllUsers() throws IOException;
    Path getExportFileForAllUsers();

}
