package com.santidev.policonsultorio_service.services;

import com.santidev.policonsultorio_service.model.dtos.ClinicaResponse;
import com.santidev.policonsultorio_service.model.dtos.TurnoRequest;
import com.santidev.policonsultorio_service.model.dtos.TurnoResponse;
import com.santidev.policonsultorio_service.model.entities.Turno;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.ClinicaRepository;
import com.santidev.policonsultorio_service.repositories.MedicoRepository;
import com.santidev.policonsultorio_service.repositories.TurnoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final MedicoRepository medicoRepository;
    private final ClinicaRepository clinicaRepository;

    public TurnoResponse getById(long id){

        return Mapper.mapToTurnoResponse(turnoRepository.getById(id));

    }

    public List<TurnoResponse> getAll(){

        return turnoRepository.findAll().stream().map(Mapper::mapToTurnoResponse).toList();

    }

    public void addTurno(TurnoRequest turnoRequest) {
        var turno = Turno.builder()
                .fecha(turnoRequest.getFecha())
                .estado(turnoRequest.getEstado())
                .clinica(clinicaRepository.findById(turnoRequest.getClinica().getId())
                        .orElseThrow(()-> new RuntimeException("Clinica no encontrada con la id "+turnoRequest.getClinica().getId())))
                .medico(medicoRepository.findById(turnoRequest.getMedico().getId())
                        .orElseThrow(() -> new RuntimeException("Medico no encontrado con la id "+turnoRequest.getMedico().getId())))
                .build();

        turnoRepository.save(turno);

        log.info("turno added: {}", turno);
    }
}
