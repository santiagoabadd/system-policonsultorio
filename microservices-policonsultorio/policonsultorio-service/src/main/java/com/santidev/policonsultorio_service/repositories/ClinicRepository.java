package com.santidev.policonsultorio_service.repositories;

import com.santidev.policonsultorio_service.model.entities.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {
}
