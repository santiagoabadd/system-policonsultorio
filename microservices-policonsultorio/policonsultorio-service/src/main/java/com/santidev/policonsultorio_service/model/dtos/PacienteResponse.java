package com.santidev.policonsultorio_service.model.dtos;


import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PacienteResponse {

    private long id;

    private String nombre;
    private String telefono;
    private String direccion;
    private String Dni;
    private List<TurnoResponse> turnos;
}
