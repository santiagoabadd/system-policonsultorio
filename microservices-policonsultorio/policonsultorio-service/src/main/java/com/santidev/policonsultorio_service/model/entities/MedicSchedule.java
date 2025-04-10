package com.santidev.policonsultorio_service.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "medic_schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    private LocalTime startTime;
    private LocalTime endTime;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "medic_id")
    private Medic medic;
}