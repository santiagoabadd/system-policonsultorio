package com.santidev.policonsultorio_service.repositories;

import com.santidev.policonsultorio_service.model.entities.Medic;
import com.santidev.policonsultorio_service.model.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.DayOfWeek;
import java.util.List;

public interface MedicRepository extends JpaRepository<Medic, Long> {

    Medic findByAuthUserId(String authUserId);

    List<Medic> findBySpecialty(String specialty);

    @Query("SELECT DISTINCT m FROM Medic m " +
            "LEFT JOIN m.clinics c " +
            "WHERE (:partialName IS NULL OR m.name LIKE %:partialName%) " +
            "AND (:partialSpecialty IS NULL OR m.specialty LIKE %:partialSpecialty%) "+
            "AND (:clinicId IS NULL OR c.id = :clinicId)")
    List<Medic> findMedicsByPartialFields(
            @Param("partialName") String partialName,
            @Param("partialSpecialty") String partialSpecialty,
            @Param("clinicId") Long clinicId);

    @Query("""
        SELECT DISTINCT m
        FROM Medic m
        JOIN m.schedule s
        WHERE s.clinic.id = :clinicId AND s.dayOfWeek = :dayOfWeek
    """)
    List<Medic> findMedicsByClinicAndDay(@Param("clinicId") Long clinicId, @Param("dayOfWeek") DayOfWeek dayOfWeek);
}
