import React, { useState } from "react";
import { Patients } from "../features/patient/Patients";
import { NavBar } from "../features/nav/NavBar";


export const PatientsPage: React.FC = () => {

     
    

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">

      <NavBar/>
      <Patients/>
    </div>
  )
}

