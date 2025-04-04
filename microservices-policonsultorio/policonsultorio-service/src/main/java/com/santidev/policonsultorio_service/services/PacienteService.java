package com.santidev.policonsultorio_service.services;


import com.santidev.policonsultorio_service.model.dtos.MedicoResponse;
import com.santidev.policonsultorio_service.model.dtos.PacienteRequest;
import com.santidev.policonsultorio_service.model.dtos.PacienteResponse;
import com.santidev.policonsultorio_service.model.entities.Paciente;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.MedicoRepository;
import com.santidev.policonsultorio_service.repositories.PacienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    public PacienteResponse getById(long id){

        return Mapper.mapToPacienteResponse(pacienteRepository.getById(id));

    }

    public List<PacienteResponse> getAll(){

        return pacienteRepository.findAll().stream().map(Mapper::mapToPacienteResponse).toList();

    }

    public void addPaciente(PacienteRequest pacienteRequest) {
        var paciente = Paciente.builder()
                .nombre(pacienteRequest.getNombre())
                .Dni(pacienteRequest.getDni())
                .direccion(pacienteRequest.getDireccion())
                .build();

        pacienteRepository.save(paciente);

        log.info("paciente added: {}", paciente);
    }
}
