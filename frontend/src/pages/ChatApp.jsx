import { AllChats } from "@/components/chat/AllChats";
import { SelectedChat } from "@/components/chat/SelectedChat";
import React, { useEffect } from "react";

export const ChatApp = () => {
  return (
    <div className="flex">
      <AllChats />
      <SelectedChat />
    </div>
  );
};
