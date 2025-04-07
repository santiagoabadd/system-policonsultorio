package com.santidev.policonsultorio_service.repositories;

import com.santidev.policonsultorio_service.model.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a WHERE a.medic.id = :medicId AND a.date BETWEEN :start AND :end")
    List<Appointment> findByMedicIdAndDateBetween(
            @Param("medicId") Long medicId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    boolean existsByMedicIdAndDate(Long medicId, LocalDateTime date);

}
