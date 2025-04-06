package com.santidev.policonsultorio_service.services;

import com.santidev.policonsultorio_service.model.dtos.MedicoRequest;
import com.santidev.policonsultorio_service.model.dtos.MedicoResponse;
import com.santidev.policonsultorio_service.model.dtos.PacienteRequest;
import com.santidev.policonsultorio_service.model.entities.Medico;
import com.santidev.policonsultorio_service.model.entities.Paciente;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.ClinicaRepository;
import com.santidev.policonsultorio_service.repositories.MedicoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicoService {

    private final MedicoRepository medicoRepository;
    private final ClinicaRepository clinicaRepository;

    public MedicoResponse getById(long id){

        return Mapper.mapToMedicoResponse(medicoRepository.getById(id));

    }

    public List<MedicoResponse> getAll(){

        return medicoRepository.findAll().stream().map(Mapper::mapToMedicoResponse).toList();

    }

    public void addMedico(MedicoRequest medicoRequest) {
        var medico = Medico.builder()
                .nombre(medicoRequest.getNombre())
                .especialidad(medicoRequest.getEspecialidad())
                .clinica(clinicaRepository.findById(medicoRequest.getClinicaId())
                        .orElseThrow(()-> new RuntimeException("Clinica no encontrada con la id "+medicoRequest.getClinicaId())))
                .build();

        medicoRepository.save(medico);

        log.info("medico added: {}", medico);
    }



}
