package com.santidev.policonsultorio_service.model.dtos;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TurnoRequest {

    private String estado;
    private LocalDateTime fecha;
    private MedicoResponse medico;
    private ClinicaResponse clinica;
}
