import React, { useState } from "react";
import { PatientForm } from "../features/patient/PatientForm";
import { NavBar } from "../features/nav/NavBar";


export const PatientFormPage: React.FC = () => {


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">

      <NavBar/>
      <PatientForm/>
    </div>
  )
}

