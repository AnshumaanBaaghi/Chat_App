import io from "socket.io-client";

const getSocket = () => {
  return io("http://localhost:8080", {
    withCredentials: true,
  });
};

export const connectSocket = () => {
  const socket = getSocket();
  console.log("reducer:", socket);
  return { type: "SOCKET", payload: socket };
};
