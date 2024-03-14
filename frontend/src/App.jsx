import { useState } from "react";
import "./App.css";
import { AllRoutes } from "./routes/AllRoutes";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AllRoutes />
      <Toaster />
    </>
  );
}

export default App;
