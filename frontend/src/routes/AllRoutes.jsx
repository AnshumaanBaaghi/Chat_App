import { Login } from "@/pages/Login";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={"ChatApp"} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};
