import React, { useState } from "react";
import { HomeP } from "../features/home/HomeP";
import { NavBar } from "../features/nav/NavBar";
import { ScheduleClinic } from "../features/home/ScheduleClinic";
import { SideBar } from "../features/nav/SideBar";



export const HomePage: React.FC = () => {






  return (
    <div className="page-container">
      <div className="home-page-container">
      
        <NavBar />
        <ScheduleClinic/>
       
      </div>
    </div>
  );
};
