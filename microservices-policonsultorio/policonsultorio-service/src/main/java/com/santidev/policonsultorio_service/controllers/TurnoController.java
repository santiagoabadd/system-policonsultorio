package com.santidev.policonsultorio_service.controllers;

import com.santidev.policonsultorio_service.model.dtos.TurnoRequest;
import com.santidev.policonsultorio_service.model.dtos.TurnoResponse;
import com.santidev.policonsultorio_service.model.entities.Turno;
import com.santidev.policonsultorio_service.services.TurnoService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/turno")
@RequiredArgsConstructor
public class TurnoController {

    private final TurnoService turnoService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TurnoResponse getTurnoById(@PathVariable("id") long id){
        return turnoService.getById(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<TurnoResponse> getAllTurno(){
        return turnoService.getAll();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createTurno(@RequestBody TurnoRequest turnoRequest){
        turnoService.addTurno(turnoRequest);
    }



}
