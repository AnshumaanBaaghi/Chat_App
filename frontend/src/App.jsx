import { useEffect, useState } from "react";
import "./App.css";
import { AllRoutes } from "./routes/AllRoutes";
import { Toaster } from "@/components/ui/toaster";
import { useSelector } from "react-redux";
import { getNewFriends, getOrCreateChat } from "./redux/actions/userActions";
import {
  addParticipantInGroup,
  createGroup,
  deleteGroup,
  removeParticipantFromGroup,
} from "./api";

function App() {
  const value = useSelector((state) => state);
  console.log("value:", value);

  useEffect(() => {
    (async () => {
      try {
        // const res = await createGroup("Bhopal", [
        //   "662b8630bc0ea55b3e529737",
        //   "662fe2dd1e3a350b8f16d49b",
        // ]);
        // const res = await deleteGroup("663b6c1d26d0dbff855ae639");
        // const res = await addParticipantInGroup(
        //   "663dc87fa00ca8e3e9e8b6bf",
        //   "662b8544bc0ea55b3e52972c"
        // );
        // const res = await removeParticipantFromGroup(
        //   "663dc87fa00ca8e3e9e8b6bf",
        //   "662b8544bc0ea55b3e52972c"
        // );
        // console.log("res:", res);
      } catch (error) {
        console.log("App error:", error);
      }
    })();
  }, []);
  return (
    <>
      <AllRoutes />
      <Toaster />
    </>
  );
}

export default App;
