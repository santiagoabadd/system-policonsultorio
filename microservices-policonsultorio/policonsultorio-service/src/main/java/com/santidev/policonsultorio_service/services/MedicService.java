package com.santidev.policonsultorio_service.services;

import com.santidev.policonsultorio_service.model.dtos.*;
import com.santidev.policonsultorio_service.model.entities.Clinic;
import com.santidev.policonsultorio_service.model.entities.Medic;
import com.santidev.policonsultorio_service.model.entities.Patient;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.ClinicRepository;
import com.santidev.policonsultorio_service.repositories.MedicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.ArrayList;
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

    public List<MedicResponse> findMedicsByClinicAndDay(long clinicId, DayOfWeek dayOfWeek){

        return medicRepository.findMedicsByClinicAndDay(clinicId,dayOfWeek).stream().map(Mapper::mapToMedicResponse).toList();

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

    @Transactional
    public void addMedic(MedicRequest medicRequest) {
        Clinic clinic = clinicRepository.findById(medicRequest.getClinicId())
                .orElseThrow(() -> new RuntimeException("Clínica no encontrada"));

        var medic = Medic.builder()
                .name(medicRequest.getName())
                .specialty(medicRequest.getSpecialty())
                .clinics(new ArrayList<>())
                .authUserId(medicRequest.getAuthUserId())
                .build();

        medic.addClinic(clinic);

        medicRepository.save(medic);

        log.info("medic added: {}", medic);
    }

    @Transactional
    public void addClinicToMedic(Long medicId, Long clinicId) {
        Medic medic = medicRepository.findById(medicId).orElseThrow();
        Clinic clinic = clinicRepository.findById(clinicId).orElseThrow();

        medic.getClinics().add(clinic);
        clinic.getMedics().add(medic);

        medicRepository.save(medic);
    }


    public List<MedicResponse> findMedicByPartialFields(
            String partialName, String partialSpecialty,long clinicId) {
        return medicRepository.findMedicsByPartialFields(
                partialName, partialSpecialty,clinicId).stream().map(Mapper::mapToMedicResponse).toList();
    }





}
