package com.santidev.policonsultorio_service.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patient")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String phone;
    private String address;
    private String dni;


    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Appointment> appointments = new ArrayList<>();


    @ManyToMany(mappedBy = "patients")
    private List<Medic> medics = new ArrayList<>();

    @ManyToMany(mappedBy = "patients")
    private List<Clinic> clinics = new ArrayList<>();

    @Column(unique = true)
    private String authUserId;


    public void addClinic(Clinic clinic) {
        this.clinics.add(clinic);
        clinic.getPatients().add(this);
    }

    public void removeClinic(Clinic clinic) {
        this.clinics.remove(clinic);
        clinic.getPatients().remove(this);
    }

}
