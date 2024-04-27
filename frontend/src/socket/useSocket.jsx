import io from "socket.io-client";

const getSocket = () => {
  return io("http://localhost:8080", {
    withCredentials: true,
  });
};

import React, { useEffect, useState } from "react";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  console.log("socket render");
  useEffect(() => {
    setSocket(getSocket());
  }, []);
  return { socket };
};
