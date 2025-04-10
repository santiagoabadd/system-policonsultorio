package com.santidev.policonsultorio_service.model.dtos;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicResponse {

    private long id;

    private String name;
    private String specialty;
    private String authUserId;
    private List<MedicScheduleResponse> schedule;

}
