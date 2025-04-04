package com.santidev.policonsultorio_service.controllers;

import com.santidev.policonsultorio_service.model.dtos.ClinicaRequest;
import com.santidev.policonsultorio_service.model.dtos.ClinicaResponse;
import com.santidev.policonsultorio_service.services.ClinicaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clinica")
@RequiredArgsConstructor
public class ClinicaController {

    private final ClinicaService clinicaService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ClinicaResponse getClinicaById(@PathVariable("id") long id){
        return clinicaService.getById(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<ClinicaResponse> getAllClinica(){
        return clinicaService.getAll();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createClinica(@RequestBody ClinicaRequest clinicaRequest){
        clinicaService.addClinica(clinicaRequest);
    }

}
