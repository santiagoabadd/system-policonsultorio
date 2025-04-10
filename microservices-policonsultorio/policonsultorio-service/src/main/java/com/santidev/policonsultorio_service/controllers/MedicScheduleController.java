package com.santidev.policonsultorio_service.controllers;

import com.santidev.policonsultorio_service.model.dtos.ClinicRequest;
import com.santidev.policonsultorio_service.model.dtos.ClinicResponse;
import com.santidev.policonsultorio_service.model.dtos.MedicScheduleRequest;
import com.santidev.policonsultorio_service.model.dtos.MedicScheduleResponse;
import com.santidev.policonsultorio_service.model.entities.Medic;
import com.santidev.policonsultorio_service.services.ClinicService;
import com.santidev.policonsultorio_service.services.MedicScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicSchedule")
@RequiredArgsConstructor
public class MedicScheduleController {

    private final MedicScheduleService medicScheduleService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public MedicScheduleResponse getMedicScheduleById(@PathVariable("id") long id){
        return medicScheduleService.getById(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<MedicScheduleResponse> getAllMedicSchedule(){
        return medicScheduleService.getAll();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createMedicSchedule(@RequestBody MedicScheduleRequest medicScheduleRequest){
        medicScheduleService.addMedicSchedule(medicScheduleRequest);
    }

}
