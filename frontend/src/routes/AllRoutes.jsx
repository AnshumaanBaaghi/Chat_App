import { ChatApp } from "@/pages/ChatApp";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

export const AllRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <ChatApp />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<>404</>} />
    </Routes>
  );
};
