package com.santidev.policonsultorio_service.model.util;

import com.santidev.policonsultorio_service.model.dtos.ClinicResponse;
import com.santidev.policonsultorio_service.model.dtos.MedicResponse;
import com.santidev.policonsultorio_service.model.dtos.PatientResponse;
import com.santidev.policonsultorio_service.model.dtos.AppointmentResponse;
import com.santidev.policonsultorio_service.model.entities.Clinic;
import com.santidev.policonsultorio_service.model.entities.Medic;
import com.santidev.policonsultorio_service.model.entities.Patient;
import com.santidev.policonsultorio_service.model.entities.Appointment;

public class Mapper {


    public static MedicResponse mapToMedicResponse(Medic medic) {
        return MedicResponse.builder()
                .id(medic.getId())
                .name(medic.getName())
                .specialty(medic.getSpecialty())
                .authUserId(medic.getAuthUserId())
                .build();
    }

    public static ClinicResponse mapToClinicResponse(Clinic clinic) {
        return ClinicResponse.builder()
                .id(clinic.getId())
                .name(clinic.getName())
                .build();
    }

    public static AppointmentResponse mapToAppointmentResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .date(appointment.getDate())
                .state(appointment.getState())
                .clinic(mapToClinicResponse(appointment.getClinic()))
                .medic(mapToMedicResponse(appointment.getMedic()))
                .build();
    }

    public static PatientResponse mapToPatientResponse(Patient patient) {
        return PatientResponse.builder()
                .id(patient.getId())
                .name(patient.getName())
                .dni(patient.getDni())
                .address(patient.getAddress())
                .phone(patient.getPhone())
                .authUserId(patient.getAuthUserId())
                .appointments(patient.getAppointments().stream().map(Mapper::mapToAppointmentResponse).toList())
                .build();
    }
}
