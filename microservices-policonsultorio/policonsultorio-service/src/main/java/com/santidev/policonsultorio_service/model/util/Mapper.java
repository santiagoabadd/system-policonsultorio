package com.santidev.policonsultorio_service.model.util;

import com.santidev.policonsultorio_service.model.dtos.*;
import com.santidev.policonsultorio_service.model.entities.*;

public class Mapper {


    public static MedicResponse mapToMedicResponse(Medic medic) {
        return MedicResponse.builder()
                .id(medic.getId())
                .name(medic.getName())
                .specialty(medic.getSpecialty())
                .authUserId(medic.getAuthUserId())
                .schedule(medic.getSchedule().stream().map(Mapper::mapToMedicScheduleResponse).toList())
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
                .patient(mapToPatientResponseShort(appointment.getPatient()))
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

    public static PatientResponseShort mapToPatientResponseShort(Patient patient) {
        return PatientResponseShort.builder()
                .id(patient.getId())
                .name(patient.getName())
                .dni(patient.getDni())
                .address(patient.getAddress())
                .phone(patient.getPhone())
                .build();
    }


    public static MedicScheduleResponse mapToMedicScheduleResponse(MedicSchedule medicSchedule) {
        return MedicScheduleResponse.builder()
                .id(medicSchedule.getId())
                .startTime(medicSchedule.getStartTime())
                .endTime(medicSchedule.getEndTime())
                .dayOfWeek(medicSchedule.getDayOfWeek())
                .build();
    }
}
