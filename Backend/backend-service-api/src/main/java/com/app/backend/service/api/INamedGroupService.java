package com.app.backend.service.api;

import com.app.backend.domain.group.NamedGroup;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

public interface INamedGroupService {

    void importGroupsFromCSV(MultipartFile file) throws IOException;
    Set<NamedGroup> getAllGroups();
}
