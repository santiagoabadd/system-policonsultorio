import React, { useState } from "react";
import { HomeP } from "../features/home/HomeP";
import { NavBar } from "../features/nav/NavBar";


export const HomePage: React.FC = () => {






  return (
    <div className="page-container">
      <div className="home-page-container">
        <NavBar />
        <HomeP />

      </div>
    </div>
  );
};
