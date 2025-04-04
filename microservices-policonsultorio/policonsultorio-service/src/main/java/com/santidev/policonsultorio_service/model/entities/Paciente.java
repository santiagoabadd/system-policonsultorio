package com.santidev.policonsultorio_service.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "paciente")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String nombre;
    private String telefono;
    private String direccion;
    private String Dni;


    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL)
    private List<Turno> turnos = new ArrayList<>();


    @ManyToMany(mappedBy = "pacientes")
    private List<Medico> medicos = new ArrayList<>();



}
