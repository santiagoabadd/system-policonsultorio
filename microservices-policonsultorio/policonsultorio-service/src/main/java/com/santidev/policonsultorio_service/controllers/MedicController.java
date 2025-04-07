package com.santidev.policonsultorio_service.controllers;


import com.santidev.policonsultorio_service.model.dtos.MedicRequest;
import com.santidev.policonsultorio_service.model.dtos.MedicResponse;
import com.santidev.policonsultorio_service.services.MedicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medic")
@RequiredArgsConstructor
public class MedicController {

    private final MedicService medicService;

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

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createMedic(@RequestBody MedicRequest medicRequest){
        medicService.addMedic(medicRequest);
    }
}
