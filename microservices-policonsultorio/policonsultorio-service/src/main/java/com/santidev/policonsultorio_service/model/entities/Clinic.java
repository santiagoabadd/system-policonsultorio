package com.santidev.policonsultorio_service.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name= "clinic")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Clinic {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    private String name;


    @OneToMany(mappedBy = "clinic", cascade = CascadeType.ALL)
    private List<Medic> medics = new ArrayList<>();

    @OneToMany(mappedBy = "clinic", cascade = CascadeType.ALL)
    private List<Appointment> appointments = new ArrayList<>();
}
