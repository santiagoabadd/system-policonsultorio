package com.santidev.policonsultorio_service.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name= "clinica")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Clinica {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;

    private String nombre;


    @OneToMany(mappedBy = "clinica", cascade = CascadeType.ALL)
    private List<Medico> medicos = new ArrayList<>();

    @OneToMany(mappedBy = "clinica", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();
}
