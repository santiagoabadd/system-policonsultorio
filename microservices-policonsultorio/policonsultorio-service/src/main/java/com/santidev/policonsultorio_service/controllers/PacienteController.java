package com.santidev.policonsultorio_service.controllers;

import com.santidev.policonsultorio_service.model.dtos.PacienteRequest;
import com.santidev.policonsultorio_service.model.dtos.PacienteResponse;
import com.santidev.policonsultorio_service.services.PacienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/paciente")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService pacienteService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public PacienteResponse getPacienteById(@PathVariable("id") long id){
        return pacienteService.getById(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<PacienteResponse> getAllPaciente(){
        return pacienteService.getAll();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createPaciente(@RequestBody PacienteRequest pacienteRequest){
        pacienteService.addPaciente(pacienteRequest);
    }
}
