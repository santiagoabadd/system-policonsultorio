package com.santidev.policonsultorio_service.repositories;

import com.santidev.policonsultorio_service.model.entities.Clinic;
import com.santidev.policonsultorio_service.model.entities.Medic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {

    Clinic findByAuthUserId(String authUserId);
}
