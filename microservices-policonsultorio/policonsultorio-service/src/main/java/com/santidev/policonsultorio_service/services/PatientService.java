package com.santidev.policonsultorio_service.services;


import com.santidev.policonsultorio_service.model.dtos.PatientRequest;
import com.santidev.policonsultorio_service.model.dtos.PatientResponse;
import com.santidev.policonsultorio_service.model.entities.Patient;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientResponse getById(long id){

        return Mapper.mapToPatientResponse(patientRepository.getById(id));

    }

    public List<PatientResponse> getAll(){

        return patientRepository.findAll().stream().map(Mapper::mapToPatientResponse).toList();

    }

    public void addPatient(PatientRequest patientRequest) {
        var patient = Patient.builder()
                .name(patientRequest.getName())
                .Dni(patientRequest.getDni())
                .address(patientRequest.getAddress())
                .build();

        patientRepository.save(patient);

        log.info("patient added: {}", patient);
    }

    public List<PatientResponse> findPatientByPartialFields(
            String partialName, String partialDni, String partialPhone,String partialAddress) {
        return patientRepository.findPatientsByPartialFields(
                partialName, partialDni, partialPhone,partialAddress).stream().map(Mapper::mapToPatientResponse).toList();
    }
}
