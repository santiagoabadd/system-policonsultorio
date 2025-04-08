package com.santidev.policonsultorio_service.repositories;

import com.santidev.policonsultorio_service.model.entities.Clinic;
import com.santidev.policonsultorio_service.model.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Patient findByAuthUserId(String authUserId);

    @Query("SELECT DISTINCT p FROM Patient p " +
            "LEFT JOIN p.clinics c " +
            "WHERE (:partialName IS NULL OR p.name LIKE %:partialName%) " +
            "AND (:partialDni IS NULL OR p.dni LIKE %:partialDni%) " +
            "AND (:partialPhone IS NULL OR p.phone LIKE %:partialPhone%) " +
            "AND (:partialAddress IS NULL OR p.address LIKE %:partialAddress%) " +
            "AND (:clinicId IS NULL OR c.id = :clinicId)")
    List<Patient> findPatientsByPartialFields(
            @Param("partialName") String partialName,
            @Param("partialDni") String partialDni,
            @Param("partialPhone") String partialPhone,
            @Param("partialAddress") String partialAddress,
            @Param("clinicId") Long clinicId);

}