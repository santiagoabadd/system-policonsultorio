import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { NavBar } from "../features/nav/NavBar";
import { Medic } from "../features/medic/Medic";


export const MedicPage: React.FC = () => {

  const { id } = useParams<{ id?: string }>()  
    
  if (!id) {
    return <div>Error: medic not found with this id.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">

      <NavBar/>
      <Medic id={id} />
    </div>
  )
}

