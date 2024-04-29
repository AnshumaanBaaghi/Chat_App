import React from "react";

export const NewUserCard = ({
  socket,
  user,
  loggedInUser_id,
  sendFriendRequest,
}) => {
  return (
    <div className="flex justify-between items-center border border-red-300 py-2 px-3">
      <div>{user.name}</div>
      <button
        className="bg-blue-300 py-1 px-3 rounded-md"
        onClick={() => sendFriendRequest(socket, user.userId, loggedInUser_id)}
      >
        Add
      </button>
    </div>
  );
};
