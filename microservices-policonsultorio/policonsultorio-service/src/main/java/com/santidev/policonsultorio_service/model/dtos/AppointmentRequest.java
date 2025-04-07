package com.santidev.policonsultorio_service.model.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {

    private String state;
    private LocalDateTime date;
    private long medicId;
    private long patientId;
    private long clinicId;
}
