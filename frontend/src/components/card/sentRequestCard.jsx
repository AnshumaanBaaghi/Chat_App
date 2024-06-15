import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const SentRequestCard = ({ user }) => {
  return (
    <div className="flex justify-between items-center py-2 px-3">
      <div className="flex gap-5 items-center ">
        <Avatar size="3.5rem">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="text-black">CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{user.name}</span>
          <span className="text-sm ">{user.username}</span>
        </div>
      </div>
      <button className="text-sm bg-[#6260604f] rounded-lg px-4 py-2" disabled>
        Request Sent
      </button>
    </div>
  );
};
