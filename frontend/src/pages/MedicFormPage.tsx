import React, { useState } from "react";
import { NavBar } from "../features/nav/NavBar";
import { MedicForm } from "../features/medic/MedicForm";


export const MedicFormPage: React.FC = () => {


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">

      <NavBar/>
      <MedicForm/>
    </div>
  )
}

