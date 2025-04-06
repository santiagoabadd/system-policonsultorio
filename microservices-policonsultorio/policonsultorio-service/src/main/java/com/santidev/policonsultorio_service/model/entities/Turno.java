package com.santidev.policonsultorio_service.model.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name= "turno")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String estado;
    private LocalDateTime fecha;

    @ManyToOne
    @JoinColumn(name = "medico_id")
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "clinica_id")
    private Clinica clinica;

    @PrePersist
    @PreUpdate
    public void validateTimeSlot() {
        if (fecha != null) {
            // Check if time is within working hours (9:00-17:00)
            LocalTime time = fecha.toLocalTime();
            if (time.isBefore(LocalTime.of(9, 0))){
                throw new IllegalArgumentException("Turnos cannot be before 9:00 AM");
            }
            if (time.isAfter(LocalTime.of(17, 0))) {
                throw new IllegalArgumentException("Turnos cannot be after 5:00 PM");
            }

            // Check if time is on a 30-minute interval
            int minute = fecha.getMinute();
            if (minute != 0 && minute != 30) {
                throw new IllegalArgumentException("Turnos must be scheduled on 30-minute intervals (e.g., 9:00, 9:30)");
            }
        }
    }
}
