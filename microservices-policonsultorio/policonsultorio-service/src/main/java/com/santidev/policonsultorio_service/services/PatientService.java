package com.santidev.policonsultorio_service.services;


import com.santidev.policonsultorio_service.model.dtos.MedicResponse;
import com.santidev.policonsultorio_service.model.dtos.PatientRequest;
import com.santidev.policonsultorio_service.model.dtos.PatientResponse;
import com.santidev.policonsultorio_service.model.entities.Clinic;
import com.santidev.policonsultorio_service.model.entities.Patient;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.ClinicRepository;
import com.santidev.policonsultorio_service.repositories.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientService {

    private final PatientRepository patientRepository;
    private final ClinicRepository clinicRepository;

    public PatientResponse getById(long id){

        return Mapper.mapToPatientResponse(patientRepository.getById(id));

    }

    public List<PatientResponse> getAll(){

        return patientRepository.findAll().stream().map(Mapper::mapToPatientResponse).toList();

    }

    public PatientResponse getByAuthId(String id){

        return Mapper.mapToPatientResponse(patientRepository.findByAuthUserId(id));

    }

    @Transactional
    public void addPatient(PatientRequest patientRequest) {
        Clinic clinic = clinicRepository.findById(Long.parseLong(patientRequest.getClinicId()))
                .orElseThrow(() -> new RuntimeException("Clínica no encontrada"));

        Patient patient = Patient.builder()
                .name(patientRequest.getName())
                .phone(patientRequest.getPhone())
                .dni(patientRequest.getDni())
                .address(patientRequest.getAddress())
                .clinics(new ArrayList<>())
                .build();

        patient.addClinic(clinic);
        patientRepository.save(patient);
    }

    @Transactional
    public void addClinicToPatient(Long patientId, Long clinicId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow();
        Clinic clinic = clinicRepository.findById(clinicId).orElseThrow();

        patient.getClinics().add(clinic);
        clinic.getPatients().add(patient);

        patientRepository.save(patient);
    }

    public List<PatientResponse> findPatientByPartialFields(
            String partialName, String partialDni, String partialPhone,String partialAddress,long clinicId) {
        return patientRepository.findPatientsByPartialFields(
                partialName, partialDni, partialPhone,partialAddress,clinicId).stream().map(Mapper::mapToPatientResponse).toList();
    }
}
