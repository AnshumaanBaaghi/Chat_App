import React from "react";
import { MessageCard } from "../card/messageCard";
import { useSelector } from "react-redux";

export const Messages = ({ messages, isGroup }) => {
  console.log("messages:", messages);
  const { userDetail } = useSelector((state) => state.user);
  return (
    <div className="flex flex-col gap-4 bg-red-400 ">
      {/* <div className="text-center">Today</div> */}
      {messages.length > 0 &&
        messages.map((el) => (
          <MessageCard
            key={el._id}
            message={el.content}
            isOwnMessage={el.sender._id === userDetail?.userId}
            isGroup={isGroup}
          />
        ))}
    </div>
  );
};
