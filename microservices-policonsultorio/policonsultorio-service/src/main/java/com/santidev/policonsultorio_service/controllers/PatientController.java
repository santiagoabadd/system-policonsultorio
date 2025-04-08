package com.santidev.policonsultorio_service.controllers;

import com.santidev.policonsultorio_service.model.dtos.ClinicResponse;
import com.santidev.policonsultorio_service.model.dtos.PatientRequest;
import com.santidev.policonsultorio_service.model.dtos.PatientResponse;
import com.santidev.policonsultorio_service.services.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PatientResponse getPatientById(@PathVariable("id") long id){
        return patientService.getById(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<PatientResponse> getAllPatients(){
        return patientService.getAll();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createPatient(@RequestBody PatientRequest patientRequest){
        patientService.addPatient(patientRequest);
    }

    @GetMapping ("/patients")
    public List<PatientResponse> getPatients(
            @RequestParam(required = false) String partialName,
            @RequestParam(required = false) String partialDni,
            @RequestParam(required = false) String partialPhone,
            @RequestParam(required = false) String partialAddress,
            @RequestParam(required = false) String partialClinicId)
    {
        return patientService.findPatientByPartialFields(
                partialName,
                partialDni,
                partialPhone,
                partialAddress,
                Long.parseLong(partialClinicId));
    }

    @GetMapping("/authUserId/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PatientResponse getByAuthUserId(@PathVariable("id") String id){
        return patientService.getByAuthId(id);
    }


    @GetMapping ("/addPatient")
    public void addPatientToClinic(
            @RequestParam(required = false) Long clinicId,
            @RequestParam(required = false) Long patientId)
    {
       patientService.addClinicToPatient(patientId,clinicId);
    }

}
