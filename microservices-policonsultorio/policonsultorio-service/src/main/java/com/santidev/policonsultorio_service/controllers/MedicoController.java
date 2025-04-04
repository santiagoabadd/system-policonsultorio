package com.santidev.policonsultorio_service.controllers;


import com.santidev.policonsultorio_service.model.dtos.MedicoRequest;
import com.santidev.policonsultorio_service.model.dtos.MedicoResponse;
import com.santidev.policonsultorio_service.services.MedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/policonsultorio/medico")
@RequiredArgsConstructor
public class MedicoController {

    private final MedicoService medicoService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MedicoResponse getMedicoById(@PathVariable("id") long id){
        return medicoService.getById(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<MedicoResponse> getAllMedico(){
        return medicoService.getAll();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createMedico(@RequestBody MedicoRequest medicoRequest){
        medicoService.addMedico(medicoRequest);
    }
}
