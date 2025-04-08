package com.santidev.policonsultorio_service.controllers;

import com.santidev.policonsultorio_service.model.dtos.ClinicRequest;
import com.santidev.policonsultorio_service.model.dtos.ClinicResponse;
import com.santidev.policonsultorio_service.services.ClinicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clinic")
@RequiredArgsConstructor
public class ClinicController {

    private final ClinicService clinicService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ClinicResponse getClinicById(@PathVariable("id") long id){
        return clinicService.getById(id);
    }

    @GetMapping("/authUserId/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ClinicResponse getByAuthUserId(@PathVariable("id") String id){
        return clinicService.getByAuthId(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<ClinicResponse> getAllClinic(){
        return clinicService.getAll();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createClinic(@RequestBody ClinicRequest clinicRequest){
        clinicService.addClinic(clinicRequest);
    }

}
