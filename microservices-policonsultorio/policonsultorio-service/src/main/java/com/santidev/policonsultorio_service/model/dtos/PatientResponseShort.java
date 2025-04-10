package com.santidev.policonsultorio_service.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseShort {

    private long id;

    private String name;
    private String phone;
    private String address;
    private String dni;

}