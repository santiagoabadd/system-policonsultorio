package com.santidev.policonsultorio_service.model.dtos;


import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {

    private long id;
    private String state;
    private LocalDateTime date;
    private MedicResponse medic;
    private ClinicResponse clinic;
    private PatientResponseShort patient;
}
