package com.santidev.policonsultorio_service.model.dtos;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicResponse {

    private long id;
    private String name;

}
