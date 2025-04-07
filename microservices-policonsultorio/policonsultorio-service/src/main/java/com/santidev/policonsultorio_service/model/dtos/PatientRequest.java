package com.santidev.policonsultorio_service.model.dtos;


import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientRequest {

    private String name;
    private String phone;
    private String address;
    private String Dni;
}
