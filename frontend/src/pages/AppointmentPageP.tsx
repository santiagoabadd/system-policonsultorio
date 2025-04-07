import React, { useState } from "react";
import { AppointmentPage } from "../features/appointment/appointment-page";
import { useParams } from 'react-router-dom';
import { NavBar } from "../features/nav/NavBar";

export const AppointmentPageP: React.FC = () => {

     
  const { specialty } = useParams<{ specialty?: string }>()

  if (!specialty) {
    return <div>Error: Specialty not specified in URL.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">
      <NavBar/>
      <AppointmentPage specialty= {specialty} />
    </div>
  )
}

