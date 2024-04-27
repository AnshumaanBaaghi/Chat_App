import React from "react";

export const FriendCard = ({ user }) => {
  return (
    <div className="flex justify-between items-center border border-red-300 py-2 px-3">
      <div>{user.name}</div>
    </div>
  );
};
