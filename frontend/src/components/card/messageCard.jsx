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
        <div className="text-center text-white no-select my-3 border border-[#bcbaba61] rounded-lg py-1 px-4 mx-auto text-sm">
          {day}
        </div>
      )}
      {showUnreadMessageTag && (
        <div
          className="text-center text-white no-select my-3 border border-[#bcbaba61] bg-[#27282987] rounded-lg py-1 px-4 mx-auto text-sm"
          ref={scrollToUnreadMessageRef}
        >
          Unread Messages: {noOfUnreadMessage}
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
            isOwnMessage ? "bg-[#5a65ca]" : "bg-[#343546]"
          } text-white py-2 px-4 rounded-xl ${
            isGroup &&
            !isOwnMessage &&
            isSenderSameAsLastSender &&
            isMessageDateIsSameAsPreviousMessageDate
              ? "ml-[2.75rem]"
              : ""
          }`}
        >
          {!isOwnMessage && (
            <div className="text-yellow-500 text-sm no-select">
              {sender.name}
            </div>
          )}
          <span>
            {message}
            <p className="w-[3.5rem] inline-block"></p>
          </span>
          <span
            className={`absolute ${
              isOwnMessage ? "text-[#c9c9e8]" : "text-[#9a9cae]"
            }  right-2 text-[11px] bottom-1 no-select`}
          >
            {time}
          </span>
        </p>
      </div>
    </>
  );
};
