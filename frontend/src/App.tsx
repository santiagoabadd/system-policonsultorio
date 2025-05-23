import React from 'react';
import "./assets/global.css"
import "./assets/sidebar.css" 
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { Theme } from "./utils/GlobalInterfaces";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";

import './sass/index.scss';
import ProtectedRoute from './ProtectedRoute';
import { AuthPage } from "./pages/AuthPage";
import { AppointmentPageP } from './pages/AppointmentPageP';
import { SpecialtyMenuPage } from './pages/SpecialtyMenuPage';
import { PatientsPage } from './pages/PatientsPage';
import { PatientPage } from './pages/PatientPage';
import { PatientFormPage } from './pages/PatientFormPage';
import { MedicFormPage } from './pages/MedicFormPage';
import { Medics } from './features/medic/Medics';
import { MedicsPage } from './pages/MedicsPage';
import { MedicPage } from './pages/MedicPage';
import { HomeMedicPage } from './pages/HomeMedicPage';
import { SideBar } from './features/nav/SideBar';

const theme: Theme = {
  colors: {
    blue: "#1DA1F2",
    black: "#14171a",
    darkGray: "#657786",
    gray: "#AAB8C2",
    lightGray: "#E1E8ED",
    white: "#f5f8fa",
    error: "red",
  },
};

const GlobalStyle = createGlobalStyle`
*{

}
`;

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SideBar />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turno/:specialty"
          element={
            <ProtectedRoute requiredRole="RECEPCIONISTA">
              <AppointmentPageP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menuEspecialidad"
          element={
            <ProtectedRoute requiredRole="RECEPCIONISTA">
              <SpecialtyMenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute requiredRole="RECEPCIONISTA">
              <PatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paciente/:id"
          element={
            <ProtectedRoute requiredRole="RECEPCIONISTA">
              <PatientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paciente/form"
          element={
            <ProtectedRoute requiredRole="RECEPCIONISTA">
              <PatientFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medico/form"
          element={
            <ProtectedRoute requiredRole="RECEPCIONISTA">
              <MedicFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medicos"
          element={
            <ProtectedRoute requiredRole="RECEPCIONISTA">
              <MedicsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/medico/:id"
          element={
            <ProtectedRoute requiredRole="RECEPCIONISTA">
              <MedicPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home/medicos"
          element={
            <ProtectedRoute requiredRole="MEDICO">
              <HomeMedicPage/>
            </ProtectedRoute>
          }
        />


      </Routes>
    </ThemeProvider>
  );
};