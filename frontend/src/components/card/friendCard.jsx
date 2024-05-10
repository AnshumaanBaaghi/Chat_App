import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";

export const FriendCard = ({ user }) => {
  const handleChat = (e) => {};
  useEffect(() => {}, []);
  return (
    // <DialogClose asChild>
    <div
      className="flex gap-5 items-center border border-red-300 py-2 px-3"
      onClick={handleChat}
    >
      <Avatar size="3.5rem">
        <AvatarImage src="https:encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ZLEEDaC7_8qJqkthsik-Q0rr7TSzGfU6XA&usqp=CAU" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-semibold">{user.name}</span>
        <span className="text-sm text-gray-700">{user.username}</span>
      </div>
    </div>
    // </DialogClose>
  );
};
