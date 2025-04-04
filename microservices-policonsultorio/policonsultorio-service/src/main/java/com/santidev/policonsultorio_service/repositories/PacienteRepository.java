package com.santidev.policonsultorio_service.repositories;

import com.santidev.policonsultorio_service.model.entities.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
}
