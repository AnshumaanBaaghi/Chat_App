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
  time,
  isMessageDateIsSameAsPreviousMessageDate,
  day,
  showUnreadMessageTag,
  noOfUnreadMessage,
  scrollToUnreadMessageRef,
}) => {
  return (
    <>
      {!isMessageDateIsSameAsPreviousMessageDate && (
        <div className="text-center text-white no-select my-3 border border-white rounded-xl py-2 px-5 mx-auto">
          {day}
        </div>
      )}
      {showUnreadMessageTag && (
        <div
          className="text-center text-white no-select"
          ref={scrollToUnreadMessageRef}
        >
          Unread Messages {noOfUnreadMessage}
        </div>
      )}
      <div
        className={`flex gap-1 ${isOwnMessage ? "justify-end" : ""} ${
          !isSenderSameAsLastSender ? "mt-4" : ""
        }`}
      >
        {isGroup &&
          !isOwnMessage &&
          (!isSenderSameAsLastSender ||
            !isMessageDateIsSameAsPreviousMessageDate) && (
            <Avatar size="2.5rem" className="h-[2.5rem]">
              <AvatarImage src={sender.avatar} />
              <AvatarFallback className="h-[2.5rem]">
                <ReactIcon color="gray" className="bg-green-500" size="100%">
                  <FaCircleUser />
                </ReactIcon>
              </AvatarFallback>
            </Avatar>
          )}
        <p
          className={`relative max-w-[60%] ${
            isOwnMessage ? "bg-[#172331]" : "bg-[#272134]"
          } text-white py-2 pl-4 pr-[4.5rem] rounded-xl ${
            isGroup &&
            !isOwnMessage &&
            isSenderSameAsLastSender &&
            isMessageDateIsSameAsPreviousMessageDate
              ? "ml-[2.75rem]"
              : ""
          }`}
        >
          {!isOwnMessage && (
            <div className="text-yellow-500">{sender.name}</div>
          )}
          <span>{message}</span>
          <span className="absolute text-[#9a9cae] right-2 text-[11px] bottom-1 no-select">
            {time}
          </span>
        </p>
      </div>
    </>
  );
};
