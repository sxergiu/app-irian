package com.app.backend.domain.group;

import jakarta.persistence.*;

@Entity
public class NamedGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer numberOfPeople;

    public NamedGroup(Long id, String name, Integer numberOfPeople) {
        this.id = id;
        this.name = name;
        this.numberOfPeople = numberOfPeople;
    }

    public NamedGroup() {

    }

    public Integer getNumberOfPeople() {
        return numberOfPeople;
    }

    public void setNumberOfPeople(Integer numberOfPeople) {
        this.numberOfPeople = numberOfPeople;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Group{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", numberOfPeople=" + numberOfPeople +
                '}';
    }
}
