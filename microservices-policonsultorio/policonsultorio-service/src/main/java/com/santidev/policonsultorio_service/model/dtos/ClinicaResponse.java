package com.santidev.policonsultorio_service.model.dtos;


import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicaResponse {

    private long id;
    private String nombre;

}
