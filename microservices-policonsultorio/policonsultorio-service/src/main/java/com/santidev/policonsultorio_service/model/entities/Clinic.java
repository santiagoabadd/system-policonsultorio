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
    private List<Appointment> appointments = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "clinic_patient",
            joinColumns = @JoinColumn(name = "clinic_id"),
            inverseJoinColumns = @JoinColumn(name = "patient_id")
    )
    private List<Patient> patients = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "clinic_medic",
            joinColumns = @JoinColumn(name = "clinic_id"),
            inverseJoinColumns = @JoinColumn(name = "medic_id")
    )
    private List<Medic> medics = new ArrayList<>();

    @Column(unique = true)
    private String authUserId;


}
