package com.santidev.policonsultorio_service.controllers;

import com.santidev.policonsultorio_service.model.dtos.AvailableRequest;
import com.santidev.policonsultorio_service.model.dtos.AppointmentRequest;
import com.santidev.policonsultorio_service.model.dtos.AppointmentResponse;
import com.santidev.policonsultorio_service.services.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/appointment")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AppointmentResponse getAppointmentById(@PathVariable("id") long id){
        return appointmentService.getById(id);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<AppointmentResponse> getAllAppointment(){
        return appointmentService.getAll();
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public void createAppointment(@RequestBody AppointmentRequest appointmentRequest){
        appointmentService.addAppointment(appointmentRequest);
    }

    @PostMapping("/available")
    public List<LocalDateTime> getAvailableSlots(
            @RequestBody AvailableRequest request
    ) {
        System.out.println(request);
        return appointmentService.getAvailableTimeSlots(request);
    }


}
