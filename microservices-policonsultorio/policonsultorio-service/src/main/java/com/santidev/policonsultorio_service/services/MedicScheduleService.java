package com.santidev.policonsultorio_service.services;


import com.santidev.policonsultorio_service.model.dtos.MedicScheduleRequest;
import com.santidev.policonsultorio_service.model.dtos.MedicScheduleResponse;
import com.santidev.policonsultorio_service.model.entities.MedicSchedule;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.ClinicRepository;
import com.santidev.policonsultorio_service.repositories.MedicRepository;
import com.santidev.policonsultorio_service.repositories.MedicScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;


@Service
@RequiredArgsConstructor
@Slf4j
public class MedicScheduleService {

    private final MedicScheduleRepository medicScheduleRepository;
    private final MedicRepository medicRepository;
    private final ClinicRepository clinicRepository;


    public MedicScheduleResponse getById(long id){

        return Mapper.mapToMedicScheduleResponse(medicScheduleRepository.findById(id).orElseThrow(()-> new RuntimeException("schedule not found with this id ")));

    }





    public List<MedicScheduleResponse> getAll(){

        return medicScheduleRepository.findAll().stream().map(Mapper::mapToMedicScheduleResponse).toList();

    }



    public void addMedicSchedule(MedicScheduleRequest medicScheduleRequest) {
        var clinic = MedicSchedule.builder()
                        .medic(medicRepository.findById(Long.parseLong(medicScheduleRequest.getMedicId())).orElseThrow(()-> new RuntimeException("medic not found with this id ")))
                        .clinic(clinicRepository.findById(Long.parseLong(medicScheduleRequest.getClinicId())).orElseThrow(()-> new RuntimeException("clinic not found with this id ")))
                        .endTime(medicScheduleRequest.getEndTime())
                        .startTime(medicScheduleRequest.getStartTime())
                        .dayOfWeek(medicScheduleRequest.getDayOfWeek())
                        .build();
                        medicScheduleRepository.save(clinic);


    }
}
