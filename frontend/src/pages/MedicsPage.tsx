import React, { useState } from "react";
import { NavBar } from "../features/nav/NavBar";
import { Medics } from "../features/medic/Medics";


export const MedicsPage: React.FC = () => {

     
    

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">

      <NavBar/>
      <Medics/>
    </div>
  )
}

