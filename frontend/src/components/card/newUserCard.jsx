import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const NewUserCard = ({
  socket,
  user,
  loggedInUser_id,
  sendFriendRequest,
}) => {
  return (
    <div className="flex justify-between items-center border border-blue-300 py-2 px-3">
      <div className="flex gap-5 items-center border border-red-300 w-full">
        <Avatar size="12%">
          <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ZLEEDaC7_8qJqkthsik-Q0rr7TSzGfU6XA&usqp=CAU" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{user.name}</span>
          <span className="text-sm text-gray-700">{user.username}</span>
        </div>
      </div>
      <button
        className="bg-blue-300 py-1 px-3 rounded-md"
        onClick={() => sendFriendRequest(socket, user.userId, loggedInUser_id)}
      >
        Add
      </button>
    </div>
  );
};
