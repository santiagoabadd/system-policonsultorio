import React from 'react';
import "./assets/global.css"
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { Theme } from "./utils/GlobalInterfaces";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";

import './sass/index.scss';
import ProtectedRoute from './ProtectedRoute';
import AuthPage from "./pages/AuthPage";
import TurnoPage from './pages/TurnoPage';

const theme: Theme = {
  colors: {
    blue: "#1DA1F2",
    black: "#14171a",
    darkGray: "#657786",
    gray: "#AAB8C2",
    lightGray: "#E1E8ED",
    white: "#f5f8fa",
    error: "red",
  },
};

const GlobalStyle = createGlobalStyle`
*{

}
`;

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<AuthPage/>} />
        <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turno"
            element={
              <ProtectedRoute>
                <TurnoPage/>
              </ProtectedRoute>
            }
          />
        
      </Routes>
    </ThemeProvider>
  );
};