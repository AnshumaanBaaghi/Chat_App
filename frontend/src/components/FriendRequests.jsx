import React from "react";
import { FriendRequestCard } from "@/components/card/friendRequestCard";

export const FriendRequests = ({ arr }) => {
  console.log("arr:", arr);
  return (
    <div>
      {arr && arr.map((el) => <FriendRequestCard key={el._id} user={el} />)}
    </div>
  );
};
