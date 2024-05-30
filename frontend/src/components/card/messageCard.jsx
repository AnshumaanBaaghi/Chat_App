import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactIcon } from "../ReactIcon";
import { FaCircleUser } from "react-icons/fa6";

export const MessageCard = ({
  message,
  isGroup,
  isOwnMessage,
  sender,
  isSenderSameAsLastSender,
}) => {
  return (
    <div className={`flex gap-1 ${isOwnMessage ? "justify-end" : ""}`}>
      {isGroup && !isOwnMessage && !isSenderSameAsLastSender && (
        <Avatar size="2.5rem">
          <AvatarImage src={sender.avatar} />
          <AvatarFallback className="h-[2.5rem]">
            <ReactIcon color="gray" className="bg-green-500" size="100%">
              <FaCircleUser />
            </ReactIcon>
          </AvatarFallback>
        </Avatar>
      )}
      <p
        className={`relative max-w-[60%] bg-blue-300 py-2 pl-2 pr-[4.5rem] rounded-xl ${
          isGroup && !isOwnMessage && isSenderSameAsLastSender
            ? "ml-[2.75rem]"
            : ""
        }`}
      >
        <div>{message}</div>
        <span className="absolute right-2 text-xs bottom-1">07:20 PM</span>
      </p>
    </div>
  );
};
