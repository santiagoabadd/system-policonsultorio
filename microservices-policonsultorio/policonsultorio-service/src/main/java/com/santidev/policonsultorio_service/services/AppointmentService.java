package com.santidev.policonsultorio_service.services;

import com.santidev.policonsultorio_service.model.dtos.AvailableRequest;
import com.santidev.policonsultorio_service.model.dtos.AppointmentRequest;
import com.santidev.policonsultorio_service.model.dtos.AppointmentResponse;
import com.santidev.policonsultorio_service.model.entities.Appointment;
import com.santidev.policonsultorio_service.model.util.Mapper;
import com.santidev.policonsultorio_service.repositories.ClinicRepository;
import com.santidev.policonsultorio_service.repositories.MedicRepository;
import com.santidev.policonsultorio_service.repositories.PatientRepository;
import com.santidev.policonsultorio_service.repositories.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


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

    public AppointmentResponse getById(long id){

        return Mapper.mapToAppointmentResponse(appointmentRepository.getById(id));

    }

    public List<AppointmentResponse> getAll(){

        return appointmentRepository.findAll().stream().map(Mapper::mapToAppointmentResponse).toList();

    }

    public List<LocalDateTime> getAvailableTimeSlots(AvailableRequest availableRequest) {
        List<LocalDateTime> availableSlots = new ArrayList<>();

        // Generate all possible slots for the day
        LocalDateTime start = LocalDateTime.of(availableRequest.getDate(), LocalTime.of(9, 0));
        LocalDateTime end = LocalDateTime.of(availableRequest.getDate(), LocalTime.of(17, 0));

        while (start.isBefore(end)) {
            availableSlots.add(start);
            start = start.plusMinutes(30);
        }


        List<Appointment> bookedAppointments = appointmentRepository.findByMedicIdAndDateBetween(
                availableRequest.getMedicId(),
                LocalDateTime.of(availableRequest.getDate(), LocalTime.MIN),
                LocalDateTime.of(availableRequest.getDate(), LocalTime.MAX)
        );


        // Remove booked slots from available slots
        bookedAppointments.forEach(appointment -> availableSlots.remove(appointment.getDate()));

        return availableSlots;
    }

    public void addAppointment(AppointmentRequest appointmentRequest) {

        // Validate time is on 30-minute interval
        LocalDateTime requestedTime = appointmentRequest.getDate();
        if (requestedTime.getMinute() % 30 != 0) {
            throw new IllegalArgumentException("Appointments must be scheduled on 30-minute intervals");
        }

        // Check for existing appointments at the exact same time
        boolean timeSlotTaken = appointmentRepository.existsByMedicIdAndDate(
                appointmentRequest.getMedicId(),
                requestedTime
        );

        if (timeSlotTaken) {
            throw new IllegalStateException("Time slot " + requestedTime + " is already taken");
        }

        // Optional: Check if time is within working hours (9:00-17:00)
        LocalTime time = requestedTime.toLocalTime();
        if (time.isBefore(LocalTime.of(9, 0))){
            throw new IllegalArgumentException("Appointments cannot be before 9:00 AM");
        }
        if (time.isAfter(LocalTime.of(17, 0))) {
            throw new IllegalArgumentException("Appointments cannot be after 5:00 PM");
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
}
