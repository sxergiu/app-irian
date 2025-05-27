package com.app.backend.service;

import com.app.backend.domain.group.GroupJPARepository;
import com.app.backend.domain.group.NamedGroup;
import com.app.backend.service.api.INamedGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;

@Service
public class NamedGroupService implements INamedGroupService {

    @Autowired
    private GroupJPARepository groupRepository;

    public void importGroupsFromCSV(MultipartFile file) throws IOException {

        BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
        String line;
        boolean isFirstLine = true;

        while ((line = reader.readLine()) != null) {

            if (isFirstLine) {
                isFirstLine = false;
                continue;
            }

            String[] parts = line.split(",");
            if (parts.length != 2) continue;

            String name = parts[0].trim();
            int number = Integer.parseInt(parts[1].trim());

            if (groupRepository.findByName(name).isEmpty()) {
                NamedGroup group = new NamedGroup();
                group.setName(name);
                group.setNumberOfPeople(number);
                groupRepository.save(group);
            }
        }
    }

    public Set<NamedGroup> getAllGroups() {
        return new HashSet<>(groupRepository.findAll());
    }
}
