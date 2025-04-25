package com.santidev.policonsultorio_service.controllers;


import com.santidev.policonsultorio_service.model.dtos.MedicRequest;
import com.santidev.policonsultorio_service.model.dtos.MedicResponse;
import com.santidev.policonsultorio_service.model.dtos.PatientResponse;
import com.santidev.policonsultorio_service.services.MedicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;

@RestController
@RequestMapping("/medic")
@RequiredArgsConstructor
public class MedicController {

    private final MedicService medicService;


    @GetMapping("/authUserId/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MedicResponse getByAuthUserId(@PathVariable("id") String id){
        return medicService.getByAuthId(id);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MedicResponse getMedicById(@PathVariable("id") long id){
        return medicService.getById(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<MedicResponse> getAllMedic(){
        return medicService.getAll();
    }

    @GetMapping("/specialty/{specialty}")
    @ResponseStatus(HttpStatus.OK)
    public List<MedicResponse> getAllMedic(@PathVariable("specialty") String specialty){
        return medicService.getBySpecialty(specialty);
    }

    @GetMapping("/{clinicId}/medics")
    public List<MedicResponse> getMedicsByClinicAndDay(
            @PathVariable Long clinicId,
            @RequestParam DayOfWeek dayOfWeek
    ) {
        return medicService.findMedicsByClinicAndDay(clinicId,dayOfWeek);
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createMedic(@RequestBody MedicRequest medicRequest){
        System.out.println(medicRequest.getAuthUserId());
        System.out.println(medicRequest.getAuthUserId());
        System.out.println(medicRequest.getAuthUserId());
        System.out.println(medicRequest.getAuthUserId());
        medicService.addMedic(medicRequest);
    }

    @GetMapping ("/medics")
    public List<MedicResponse> getMedics(
            @RequestParam(required = false) String partialName,
            @RequestParam(required = false) String partialSpecialty,
            @RequestParam(required = false) String partialClinicId)
    {
        return medicService.findMedicByPartialFields(
                partialName,
                partialSpecialty,
                Long.parseLong(partialClinicId));
    }

    @PostMapping ("/addMedic")
    public void addMedicToClinic(
            @RequestParam(required = false) Long clinicId,
            @RequestParam(required = false) Long medicId)
    {
        medicService.addClinicToMedic(medicId,clinicId);
    }
}
