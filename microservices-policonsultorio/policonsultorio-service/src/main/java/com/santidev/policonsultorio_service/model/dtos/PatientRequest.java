package com.santidev.policonsultorio_service.model.dtos;


import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientRequest {

    private String name;
    private String phone;
    private String address;
    private String dni;
    private String clinicId;
    private String authUserId;
}
