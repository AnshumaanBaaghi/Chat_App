import React from "react";

export const FriendRequestCard = ({ user }) => {
  return (
    <div className="flex justify-between items-center border border-red-300 py-2 px-3">
      <div>{user.name}</div>
      <button className="bg-blue-300 py-1 px-3 rounded-md">Accept</button>
    </div>
  );
};
