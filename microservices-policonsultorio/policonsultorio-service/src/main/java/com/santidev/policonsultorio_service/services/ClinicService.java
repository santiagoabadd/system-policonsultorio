package com.santidev.policonsultorio_service.services;

import com.santidev.policonsultorio_service.model.dtos.ClinicRequest;
import com.santidev.policonsultorio_service.model.dtos.ClinicResponse;
import com.santidev.policonsultorio_service.model.entities.Clinic;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.ClinicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class ClinicService {

    private final ClinicRepository clinicRepository;

    public ClinicResponse getById(long id){

        return Mapper.mapToClinicResponse(clinicRepository.findById(id).orElseThrow(()-> new RuntimeException("clinic not found with this id ")));

    }

    public ClinicResponse getByAuthId(String id){

        return Mapper.mapToClinicResponse(clinicRepository.findByAuthUserId(id));

    }

    public List<ClinicResponse> getAll(){

        return clinicRepository.findAll().stream().map(Mapper::mapToClinicResponse).toList();

    }

    public List<ClinicResponse> getByMedic(Long medicId){

        return clinicRepository.findByMedicId(medicId).stream().map(Mapper::mapToClinicResponse).toList();

    }

    public void addClinic(ClinicRequest clinicRequest) {
        var clinic = Clinic.builder()
                .name(clinicRequest.getName())
                .build();

        clinicRepository.save(clinic);

        log.info("clinic added: {}", clinic);
    }
}
