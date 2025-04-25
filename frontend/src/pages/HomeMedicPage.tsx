import React, { useState } from "react";
import { NavBar } from "../features/nav/NavBar";
import { HomeMedic } from "../features/home/HomeMedic";


export const HomeMedicPage: React.FC = () => {






  return (
    <div className="page-container">
      <div className="home-page-container">
        <NavBar />
        <HomeMedic/>

      </div>
    </div>
  );
};
