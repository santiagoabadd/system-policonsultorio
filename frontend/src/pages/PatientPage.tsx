import React, { useState } from "react";
import { Patient } from "../features/patient/Patient";
import { useParams } from "react-router-dom";
import { NavBar } from "../features/nav/NavBar";


export const PatientPage: React.FC = () => {

  const { id } = useParams<{ id?: string }>()  
    
  if (!id) {
    return <div>Error: patient not found with this id.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">

      <NavBar/>
      <Patient id={id} />
    </div>
  )
}

