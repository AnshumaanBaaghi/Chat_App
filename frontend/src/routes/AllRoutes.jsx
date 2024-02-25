import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Otp } from "@/pages/Otp";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={"ChatApp"} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="*" element={<>404</>} />
    </Routes>
  );
};
