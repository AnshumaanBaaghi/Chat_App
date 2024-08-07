import "./App.css";
import { AllRoutes } from "./routes/AllRoutes";
import { Toaster } from "@/components/ui/toaster";
import { useSelector } from "react-redux";

function App() {
  const value = useSelector((state) => state);
  return (
    <>
      <AllRoutes />
      <Toaster />
    </>
  );
}

export default App;
