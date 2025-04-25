package com.santidev.policonsultorio_service.repositories;

import com.santidev.policonsultorio_service.model.entities.Clinic;
import com.santidev.policonsultorio_service.model.entities.Medic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {

    Clinic findByAuthUserId(String authUserId);

    @Query("SELECT c FROM Clinic c JOIN c.medics m WHERE m.id = :medicId")
    List<Clinic> findByMedicId(@Param("medicId") Long medicId);;
}
