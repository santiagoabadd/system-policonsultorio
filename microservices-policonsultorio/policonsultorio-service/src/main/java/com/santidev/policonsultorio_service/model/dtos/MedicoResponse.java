package com.santidev.policonsultorio_service.model.dtos;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicoResponse {

    private long id;

    private String nombre;
    private String especialidad;

}
