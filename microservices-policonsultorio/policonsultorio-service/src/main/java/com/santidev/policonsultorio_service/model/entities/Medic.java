package com.santidev.policonsultorio_service.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name= "medic")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Medic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private String specialty;

    @ManyToMany(mappedBy = "medics")
    private List<Clinic> clinics = new ArrayList<>();

    @OneToMany(mappedBy = "medic", cascade = CascadeType.ALL)
    private List<Appointment> appointments = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "medic_patient",
            joinColumns = @JoinColumn(name = "medic_id"),
            inverseJoinColumns = @JoinColumn(name = "patient_id")
    )
    private List<Patient> patients = new ArrayList<>();

    @Column(unique = true)
    private String authUserId;

    public void addClinic(Clinic clinic) {
        this.clinics.add(clinic);
        clinic.getMedics().add(this);
    }

    public void removeClinic(Clinic clinic) {
        this.clinics.remove(clinic);
        clinic.getMedics().remove(this);
    }

}
