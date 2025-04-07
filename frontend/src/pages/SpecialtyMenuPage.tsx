import React, { useState } from "react";
import { SpecialtyMenu } from "../features/menu/SpecialtyMenu";
import { NavBar } from "../features/nav/NavBar";


export const SpecialtyMenuPage: React.FC = () => {

     
    

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50">

      <NavBar/>
      <SpecialtyMenu/>
    </div>
  )
}

