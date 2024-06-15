import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "../ui/button";
import { getOrCreateChat_api } from "@/api";

export const FriendRequestCard = ({ socket, user, acceptFriendRequest }) => {
  const handleClick = async () => {
    try {
      await getOrCreateChat_api(user.userId);
      acceptFriendRequest(socket, user.requestId);
    } catch (error) {
      console.log("error:", error);
    }
  };
  return (
    <div className="flex justify-between items-center py-2 px-3">
      <div className="flex gap-5 items-center">
        <Avatar size="3.5rem">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="text-black">CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{user.name}</span>
          <span className="text-sm ">{user.username}</span>
        </div>
      </div>
      <Button className="border border-[#ffffff3a]" onClick={handleClick}>
        Accept
      </Button>
    </div>
  );
};
