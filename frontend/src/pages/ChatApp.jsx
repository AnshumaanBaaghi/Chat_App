import { AllChats } from "@/components/chat/AllChats";
import { SelectedChat } from "@/components/chat/SelectedChat";
import { connectSocket, socket } from "@/socket";
import React, { useEffect } from "react";

export const ChatApp = () => {
  useEffect(() => {
    if (!socket) {
      connectSocket();
      return;
    }
    socket.on("new-friend-request", (data) => {
      console.log("new-friend-request:", data);
    });
    socket.on("request-sent", (data) => {
      console.log("request-sent:", data);
    });
    socket.on("request-accepted", (data) => {
      console.log("request-accepted:", data);
    });

    return () => {
      socket.off("new-friend-request");
      socket.off("request-sent");
      socket.off("request-accepted");
    };
  }, [socket]);

  return (
    <div className="flex">
      <AllChats />
      <SelectedChat />
    </div>
  );
};
