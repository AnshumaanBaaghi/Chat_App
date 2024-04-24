import io from "socket.io-client";

export let socket;

export const connectSocket = () => {
  socket = io("http://localhost:8080", {
    withCredentials: true,
  });
};
