import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const FriendCard = ({ user, onClickCallbackFunction }) => {
  return (
    <div
      className="flex gap-5 items-center py-2 px-3 cursor-pointer"
      onClick={() =>
        onClickCallbackFunction && onClickCallbackFunction(user.userId)
      }
    >
      <Avatar size="3.5rem">
        <AvatarImage src={user.avatar} />
        <AvatarFallback className="text-black">CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-semibold">{user.name}</span>
        <span className="text-sm ">{user.username}</span>
      </div>
    </div>
  );
};
