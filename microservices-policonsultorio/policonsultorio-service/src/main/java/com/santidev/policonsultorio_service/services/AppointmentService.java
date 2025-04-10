package com.santidev.policonsultorio_service.services;

import com.santidev.policonsultorio_service.model.dtos.AvailableRequest;
import com.santidev.policonsultorio_service.model.dtos.AppointmentRequest;
import com.santidev.policonsultorio_service.model.dtos.AppointmentResponse;
import com.santidev.policonsultorio_service.model.entities.Appointment;
import com.santidev.policonsultorio_service.model.entities.MedicSchedule;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final MedicRepository medicRepository;
    private final ClinicRepository clinicRepository;
    private final PatientRepository patientRepository;
    private final MedicScheduleRepository medicScheduleRepository;

    public AppointmentResponse getById(long id){

        return Mapper.mapToAppointmentResponse(appointmentRepository.getById(id));

    }

    public List<AppointmentResponse> getAll(){

        return appointmentRepository.findAll().stream().map(Mapper::mapToAppointmentResponse).toList();

    }

    public List<AppointmentResponse> getByMedicAndClinicAndDate(long medicId, long clinicId, LocalDate date){

        return appointmentRepository.findByMedicIdAndClinicIdAndDateBetween(medicId,clinicId,date.atStartOfDay(),date.atTime(LocalTime.MAX)).stream().map(Mapper::mapToAppointmentResponse).toList();

    }




    public List<LocalDateTime> getAvailableTimeSlots(AvailableRequest availableRequest) {
        System.out.println("availableRequest "+availableRequest);
        List<LocalDateTime> availableSlots = new ArrayList<>();
        DayOfWeek requestedDay = availableRequest.getDate().getDayOfWeek();
        System.out.println("requestedDay "+requestedDay);
        // Get medic's schedule for the given day
        List<MedicSchedule> schedules = medicScheduleRepository.findByMedicIdAndDayOfWeek(
                availableRequest.getMedicId(), requestedDay);
        System.out.println(schedules);
        if (schedules.isEmpty()) {
            return availableSlots; // No schedule = no availability
        }

        for (MedicSchedule schedule : schedules) {
            LocalDateTime start = LocalDateTime.of(availableRequest.getDate(), schedule.getStartTime());
            LocalDateTime end = LocalDateTime.of(availableRequest.getDate(), schedule.getEndTime());

            while (start.isBefore(end)) {
                availableSlots.add(start);
                start = start.plusMinutes(30);
            }
        }

        // Fetch already booked appointments
        List<Appointment> bookedAppointments = appointmentRepository.findByMedicIdAndDateBetween(
                availableRequest.getMedicId(),
                LocalDateTime.of(availableRequest.getDate(), LocalTime.MIN),
                LocalDateTime.of(availableRequest.getDate(), LocalTime.MAX)
        );

        bookedAppointments.forEach(appointment -> availableSlots.remove(appointment.getDate()));

        return availableSlots;
    }

    public void addAppointment(AppointmentRequest appointmentRequest) {

        if (!isWithinSchedule(appointmentRequest.getMedicId(), appointmentRequest.getDate())) {
            throw new IllegalArgumentException("Requested time is outside the medic's working hours");
        }

        LocalDateTime requestedTime = appointmentRequest.getDate();
        if (requestedTime.getMinute() % 30 != 0) {
            throw new IllegalArgumentException("Appointments must be scheduled on 30-minute intervals");
        }

        boolean timeSlotTaken = appointmentRepository.existsByMedicIdAndDate(
                appointmentRequest.getMedicId(),
                requestedTime
        );

        if (timeSlotTaken) {
            throw new IllegalStateException("Time slot " + requestedTime + " is already taken");
        }




        var appointment = Appointment.builder()
                .date(appointmentRequest.getDate())
                .state(appointmentRequest.getState())
                .patient(patientRepository.findById(appointmentRequest.getPatientId())
                        .orElseThrow(()-> new RuntimeException("Patient not found with id "+appointmentRequest.getPatientId())))
                .clinic(clinicRepository.findById(appointmentRequest.getClinicId())
                        .orElseThrow(()-> new RuntimeException("Clinic not found with id  "+appointmentRequest.getClinicId())))
                .medic(medicRepository.findById(appointmentRequest.getMedicId())
                        .orElseThrow(() -> new RuntimeException("Medic not found with id  "+appointmentRequest.getMedicId())))
                .build();

        appointmentRepository.save(appointment);

        log.info("appointment added: {}", appointment);
    }

    private boolean isWithinSchedule(Long medicId, LocalDateTime dateTime) {
        DayOfWeek day = dateTime.getDayOfWeek();
        LocalTime time = dateTime.toLocalTime();

        List<MedicSchedule> schedules = medicScheduleRepository.findByMedicIdAndDayOfWeek(medicId, day);

        return schedules.stream().anyMatch(s ->
                !time.isBefore(s.getStartTime()) && time.isBefore(s.getEndTime())
        );
    }
}
