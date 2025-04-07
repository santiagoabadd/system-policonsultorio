package com.santidev.policonsultorio_service.model.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name= "appointment")
@ToString(exclude = {"medic", "patient", "clinic"})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String state;
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "medic_id")
    private Medic medic;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "clinic_id")
    private Clinic clinic;

    @PrePersist
    @PreUpdate
    public void validateTimeSlot() {
        if (date != null) {
            // Check if time is within working hours (9:00-17:00)
            LocalTime time = date.toLocalTime();
            if (time.isBefore(LocalTime.of(9, 0))){
                throw new IllegalArgumentException("Appointments cannot be before 9:00 AM");
            }
            if (time.isAfter(LocalTime.of(17, 0))) {
                throw new IllegalArgumentException("Appointments cannot be after 5:00 PM");
            }

            // Check if time is on a 30-minute interval
            int minute = date.getMinute();
            if (minute != 0 && minute != 30) {
                throw new IllegalArgumentException("Appointments must be scheduled on 30-minute intervals (e.g., 9:00, 9:30)");
            }
        }
    }
}
