package com.santidev.policonsultorio_service.services;

import com.santidev.policonsultorio_service.model.dtos.ClinicaRequest;
import com.santidev.policonsultorio_service.model.dtos.ClinicaResponse;
import com.santidev.policonsultorio_service.model.dtos.PacienteRequest;
import com.santidev.policonsultorio_service.model.dtos.PacienteResponse;
import com.santidev.policonsultorio_service.model.entities.Clinica;
import com.santidev.policonsultorio_service.model.entities.Paciente;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.ClinicaRepository;
import com.santidev.policonsultorio_service.repositories.PacienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class ClinicaService {

    private final ClinicaRepository clinicaRepository;

    public ClinicaResponse getById(long id){

        return Mapper.mapToClinicaResponse(clinicaRepository.findById(id).orElseThrow(()-> new RuntimeException("no se econtro un cliente con ese id")));

    }

    public List<ClinicaResponse> getAll(){

        return clinicaRepository.findAll().stream().map(Mapper::mapToClinicaResponse).toList();

    }

    public void addClinica(ClinicaRequest clinicaRequest) {
        var clinica = Clinica.builder()
                .nombre(clinicaRequest.getNombre())
                .build();

        clinicaRepository.save(clinica);

        log.info("clinica added: {}", clinica);
    }
}
