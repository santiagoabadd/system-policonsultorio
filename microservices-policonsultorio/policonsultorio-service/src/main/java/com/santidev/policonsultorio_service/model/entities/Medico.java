package com.santidev.policonsultorio_service.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name= "medico")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Medico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nombre;
    private String especialidad;

    @ManyToOne
    @JoinColumn(name = "clinica_id")
    private Clinica clinica;

    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "medico_paciente",
            joinColumns = @JoinColumn(name = "medico_id"),
            inverseJoinColumns = @JoinColumn(name = "paciente_id")
    )
    private List<Paciente> pacientes = new ArrayList<>();

}
