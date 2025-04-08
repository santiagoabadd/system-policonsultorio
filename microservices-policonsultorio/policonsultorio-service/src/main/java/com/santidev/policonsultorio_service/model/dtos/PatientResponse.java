package com.santidev.policonsultorio_service.model.dtos;


import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {

    private long id;

    private String name;
    private String phone;
    private String address;
    private String dni;
    private List<AppointmentResponse> appointments;
    private String authUserId;
}
