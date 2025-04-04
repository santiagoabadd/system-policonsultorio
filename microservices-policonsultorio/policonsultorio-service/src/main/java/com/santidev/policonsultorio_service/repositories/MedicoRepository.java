package com.santidev.policonsultorio_service.repositories;

import com.santidev.policonsultorio_service.model.entities.Medico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicoRepository extends JpaRepository<Medico, Long> {
}
