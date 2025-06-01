package com.app.backend.web.lib.DTO.group;


public class NamedGroupResponse {

    private Long id;
    private String name;
    private int numberOfPeople;

    public NamedGroupResponse(Long id, String name, int numberOfPeople) {
        this.id = id;
        this.name = name;
        this.numberOfPeople = numberOfPeople;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getNumberOfPeople() {
        return numberOfPeople;
    }

    public void setNumberOfPeople(int numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }
}
