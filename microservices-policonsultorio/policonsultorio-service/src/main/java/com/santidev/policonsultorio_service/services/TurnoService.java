package com.santidev.policonsultorio_service.services;

import com.santidev.policonsultorio_service.model.dtos.AvailableRequest;
import com.santidev.policonsultorio_service.model.dtos.ClinicaResponse;
import com.santidev.policonsultorio_service.model.dtos.TurnoRequest;
import com.santidev.policonsultorio_service.model.dtos.TurnoResponse;
import com.santidev.policonsultorio_service.model.entities.Turno;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.ClinicaRepository;
import com.santidev.policonsultorio_service.repositories.MedicoRepository;
import com.santidev.policonsultorio_service.repositories.PacienteRepository;
import com.santidev.policonsultorio_service.repositories.TurnoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final MedicoRepository medicoRepository;
    private final ClinicaRepository clinicaRepository;
    private final PacienteRepository pacienteRepository;

    public TurnoResponse getById(long id){

        return Mapper.mapToTurnoResponse(turnoRepository.getById(id));

    }

    public List<TurnoResponse> getAll(){

        return turnoRepository.findAll().stream().map(Mapper::mapToTurnoResponse).toList();

    }

    public List<LocalDateTime> getAvailableTimeSlots(AvailableRequest availableRequest) {
        List<LocalDateTime> availableSlots = new ArrayList<>();

        // Generate all possible slots for the day
        LocalDateTime start = LocalDateTime.of(availableRequest.getDate(), LocalTime.of(9, 0));
        LocalDateTime end = LocalDateTime.of(availableRequest.getDate(), LocalTime.of(17, 0));

        while (start.isBefore(end)) {
            availableSlots.add(start);
            start = start.plusMinutes(30);
        }


        List<Turno> bookedTurnos = turnoRepository.findByMedicoIdAndFechaBetween(
                availableRequest.getMedicoId(),
                LocalDateTime.of(availableRequest.getDate(), LocalTime.MIN),
                LocalDateTime.of(availableRequest.getDate(), LocalTime.MAX)
        );

        // Remove booked slots from available slots
        bookedTurnos.forEach(turno -> availableSlots.remove(turno.getFecha()));

        return availableSlots;
    }

    public void addTurno(TurnoRequest turnoRequest) {

        // Validate time is on 30-minute interval
        LocalDateTime requestedTime = turnoRequest.getFecha();
        if (requestedTime.getMinute() % 30 != 0) {
            throw new IllegalArgumentException("Turnos must be scheduled on 30-minute intervals");
        }

        // Check for existing turnos at the exact same time
        boolean timeSlotTaken = turnoRepository.existsByMedicoIdAndFecha(
                turnoRequest.getMedicoId(),
                requestedTime
        );

        if (timeSlotTaken) {
            throw new IllegalStateException("Time slot " + requestedTime + " is already taken");
        }

        // Optional: Check if time is within working hours (9:00-17:00)
        LocalTime time = requestedTime.toLocalTime();
        if (time.isBefore(LocalTime.of(9, 0))){
            throw new IllegalArgumentException("Turnos cannot be before 9:00 AM");
        }
        if (time.isAfter(LocalTime.of(17, 0))) {
            throw new IllegalArgumentException("Turnos cannot be after 5:00 PM");
        }



        var turno = Turno.builder()
                .fecha(turnoRequest.getFecha())
                .estado(turnoRequest.getEstado())
                .paciente(pacienteRepository.findById(turnoRequest.getPacienteId())
                        .orElseThrow(()-> new RuntimeException("Paciente no encontrado ocn el id "+turnoRequest.getPacienteId())))
                .clinica(clinicaRepository.findById(turnoRequest.getClinicaId())
                        .orElseThrow(()-> new RuntimeException("Clinica no encontrada con la id "+turnoRequest.getClinicaId())))
                .medico(medicoRepository.findById(turnoRequest.getMedicoId())
                        .orElseThrow(() -> new RuntimeException("Medico no encontrado con la id "+turnoRequest.getMedicoId())))
                .build();

        turnoRepository.save(turno);

        log.info("turno added: {}", turno);
    }
}
