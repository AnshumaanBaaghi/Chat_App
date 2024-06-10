import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch } from "react-redux";
import { getOrCreateChat } from "@/redux/actions/userActions";

export const FriendRequestCard = ({ socket, user, acceptFriendRequest }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    acceptFriendRequest(socket, user.requestId);
    dispatch(getOrCreateChat(user.userId));
  };
  return (
    <div className="flex justify-between items-center border border-red-300 py-2 px-3">
      <div className="flex gap-5 items-center">
        <Avatar size="3.5rem">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold">{user.name}</span>
          <span className="text-sm text-gray-700">{user.username}</span>
        </div>
      </div>
      <button
        className="bg-blue-300 py-1 px-3 rounded-md"
        onClick={handleClick}
      >
        Accept
      </button>
    </div>
  );
};
