import { useEffect, useState } from "react";
import "./App.css";
import { AllRoutes } from "./routes/AllRoutes";
import { Toaster } from "@/components/ui/toaster";
import { useDispatch, useSelector } from "react-redux";
import { getNewFriends } from "./redux/actions/userActions";

function App() {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const value = useSelector((state) => state);
  console.log("value:", value);
  useEffect(() => {
    dispatch(getNewFriends());
  }, []);

  return (
    <>
      <AllRoutes />
      <Toaster />
    </>
  );
}

export default App;
