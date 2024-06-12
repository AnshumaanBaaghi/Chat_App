import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const FriendCard = ({ user, onClickCallbackFunction }) => {
  return (
    <div
      className="flex gap-5 items-center border border-red-300 py-2 px-3 cursor-pointer"
      onClick={() =>
        onClickCallbackFunction && onClickCallbackFunction(user.userId)
      }
    >
      <Avatar size="3.5rem">
        <AvatarImage src={user.avatar} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-semibold">{user.name}</span>
        <span className="text-sm text-gray-700">{user.username}</span>
      </div>
    </div>
  );
};
