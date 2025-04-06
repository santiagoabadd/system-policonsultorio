package com.santidev.policonsultorio_service.model.dtos;


import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteRequest {

    private String nombre;
    private String telefono;
    private String direccion;
    private String Dni;
}
