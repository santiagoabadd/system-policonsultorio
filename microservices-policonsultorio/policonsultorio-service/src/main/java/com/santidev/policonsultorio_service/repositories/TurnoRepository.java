package com.santidev.policonsultorio_service.repositories;

import com.santidev.policonsultorio_service.model.entities.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TurnoRepository extends JpaRepository<Turno, Long> {

    @Query("SELECT t FROM Turno t WHERE t.medico.id = :medicoId AND t.fecha BETWEEN :start AND :end")
    List<Turno> findByMedicoIdAndFechaBetween(
            @Param("medicoId") Long medicoId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    boolean existsByMedicoIdAndFecha(Long medicoId, LocalDateTime fecha);

}
