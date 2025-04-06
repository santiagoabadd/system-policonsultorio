package com.santidev.policonsultorio_service.model.dtos;

import com.santidev.policonsultorio_service.model.entities.Clinica;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicoRequest {

    private String nombre;
    private String especialidad;
    private long clinicaId;

}
