import React from "react";

export const MessageCard = ({ message, isGroup, isOwnMessage }) => {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : ""}`}>
      <p className="max-w-[60%] bg-blue-300 p-2">{message}</p>
    </div>
  );
};
