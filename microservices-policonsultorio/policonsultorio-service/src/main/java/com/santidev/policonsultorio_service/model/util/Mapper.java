package com.santidev.policonsultorio_service.model.util;

import com.santidev.policonsultorio_service.model.dtos.ClinicaResponse;
import com.santidev.policonsultorio_service.model.dtos.MedicoResponse;
import com.santidev.policonsultorio_service.model.dtos.PacienteResponse;
import com.santidev.policonsultorio_service.model.dtos.TurnoResponse;
import com.santidev.policonsultorio_service.model.entities.Clinica;
import com.santidev.policonsultorio_service.model.entities.Medico;
import com.santidev.policonsultorio_service.model.entities.Paciente;
import com.santidev.policonsultorio_service.model.entities.Turno;

public class Mapper {


    public static MedicoResponse mapToMedicoResponse(Medico medico) {
        return MedicoResponse.builder()
                .id(medico.getId())
                .nombre(medico.getNombre())
                .especialidad(medico.getEspecialidad())
                .build();
    }

    public static ClinicaResponse mapToClinicaResponse(Clinica clinica) {
        return ClinicaResponse.builder()
                .id(clinica.getId())
                .nombre(clinica.getNombre())
                .build();
    }

    public static TurnoResponse mapToTurnoResponse(Turno turno) {
        return TurnoResponse.builder()
                .id(turno.getId())
                .fecha(turno.getFecha())
                .estado(turno.getEstado())
                .clinica(mapToClinicaResponse(turno.getClinica()))
                .medico(mapToMedicoResponse(turno.getMedico()))
                .build();
    }

    public static PacienteResponse mapToPacienteResponse(Paciente paciente) {
        return PacienteResponse.builder()
                .id(paciente.getId())
                .nombre(paciente.getNombre())
                .Dni(paciente.getDni())
                .direccion(paciente.getDireccion())
                .telefono(paciente.getTelefono())
                .turnos(paciente.getTurnos().stream().map(Mapper::mapToTurnoResponse).toList())
                .build();
    }
}
