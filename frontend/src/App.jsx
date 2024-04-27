import { useEffect, useState } from "react";
import "./App.css";
import { AllRoutes } from "./routes/AllRoutes";
import { Toaster } from "@/components/ui/toaster";
import { useDispatch, useSelector } from "react-redux";
import { getNewFriends } from "./redux/actions/userActions";

function App() {
  const value = useSelector((state) => state);
  console.log("value:", value);

  return (
    <>
      <AllRoutes />
      <Toaster />
    </>
  );
}

export default App;
