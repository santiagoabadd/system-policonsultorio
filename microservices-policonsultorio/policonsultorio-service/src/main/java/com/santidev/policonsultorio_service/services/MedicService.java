package com.santidev.policonsultorio_service.services;

import com.santidev.policonsultorio_service.model.dtos.ClinicResponse;
import com.santidev.policonsultorio_service.model.dtos.MedicRequest;
import com.santidev.policonsultorio_service.model.dtos.MedicResponse;
import com.santidev.policonsultorio_service.model.dtos.PatientResponse;
import com.santidev.policonsultorio_service.model.entities.Medic;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.ClinicRepository;
import com.santidev.policonsultorio_service.repositories.MedicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicService {

    private final MedicRepository medicRepository;
    private final ClinicRepository clinicRepository;

    public MedicResponse getById(long id){

        return Mapper.mapToMedicResponse(medicRepository.getById(id));

    }

    public List<MedicResponse> getAll(){

        return medicRepository.findAll().stream().map(Mapper::mapToMedicResponse).toList();

    }

    public List<MedicResponse> getBySpecialty(String specialty){

        return medicRepository.findBySpecialty(specialty).stream().map(Mapper::mapToMedicResponse).toList();

    }

    public MedicResponse getByAuthId(String id){

        return Mapper.mapToMedicResponse(medicRepository.findByAuthUserId(id));

    }


    public void addMedic(MedicRequest medicRequest) {
        var medic = Medic.builder()
                .name(medicRequest.getName())
                .specialty(medicRequest.getSpecialty())
                .clinic(clinicRepository.findById(medicRequest.getClinicId())
                        .orElseThrow(()-> new RuntimeException("Clinic not found with id  "+medicRequest.getClinicId())))
                .build();

        medicRepository.save(medic);

        log.info("medic added: {}", medic);
    }

    public List<MedicResponse> findMedicByPartialFields(
            String partialName, String partialSpecialty) {
        return medicRepository.findMedicsByPartialFields(
                partialName, partialSpecialty).stream().map(Mapper::mapToMedicResponse).toList();
    }



}
