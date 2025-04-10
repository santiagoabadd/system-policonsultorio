package com.santidev.policonsultorio_service.repositories;


import com.santidev.policonsultorio_service.model.entities.MedicSchedule;
import org.springframework.data.jpa.repository.JpaRepository;


import java.time.DayOfWeek;
import java.util.List;

public interface MedicScheduleRepository extends JpaRepository<MedicSchedule, Long> {


        List<MedicSchedule> findByMedicId(Long medicId);
        List<MedicSchedule> findByMedicIdAndDayOfWeek(Long medicId, DayOfWeek dayOfWeek);

}
