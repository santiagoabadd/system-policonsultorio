package com.santidev.policonsultorio_service.model.dtos;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicRequest {

    private String name;
    private String specialty;
    private long clinicId;
    private String authUserId;

}
