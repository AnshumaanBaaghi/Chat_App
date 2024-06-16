import io from "socket.io-client";

const getSocket = () => {
  return io(import.meta.env.VITE_SERVER_URL, {
    withCredentials: true,
  });
};

export const connectSocket = () => {
  const socket = getSocket();
  return { type: "SOCKET", payload: socket };
};
