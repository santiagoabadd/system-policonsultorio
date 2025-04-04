package com.santidev.policonsultorio_service.model.dtos;


import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TurnoResponse {

    private long id;
    private String estado;
    private LocalDateTime fecha;
    private MedicoResponse medico;
    private ClinicaResponse clinica;
}
