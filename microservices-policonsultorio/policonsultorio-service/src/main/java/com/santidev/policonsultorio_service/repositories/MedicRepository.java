package com.santidev.policonsultorio_service.repositories;

import com.santidev.policonsultorio_service.model.entities.Medic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicRepository extends JpaRepository<Medic, Long> {

    List<Medic> findBySpecialty(String specialty);
}
