import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const Explore = ({ arr }) => {
  console.log("arr:", arr);
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.user.userDetail);

  const sendFriendRequest = (receiver_id) => {
    console.log("request sent");
    socket.emit("friend_request", { to: receiver_id, from: user.userId });
  };

  return (
    <div>
      {arr &&
        arr.map((el) => (
          <div
            key={el._id}
            className="flex justify-between items-center border border-red-300 py-2 px-3"
          >
            <div>{el.name}</div>
            <button
              className="bg-blue-300 py-1 px-3 rounded-md"
              onClick={() => sendFriendRequest(el._id)}
            >
              Add
            </button>
          </div>
        ))}
    </div>
  );
};
