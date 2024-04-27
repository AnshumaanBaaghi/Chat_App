import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NewUserCard } from "@/components/card/newUserCard";
import { SentRequestCard } from "@/components/card/sentRequestCard";
import { FriendRequestCard } from "@/components/card/friendRequestCard";
import { FriendCard } from "@/components/card/friendCard";

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
        arr.map((el) =>
          el.type == "newUser" ? (
            <NewUserCard
              key={el.user._id}
              user={el.user}
              sendFriendRequest={sendFriendRequest}
            />
          ) : el.type == "sentRequest" ? (
            <SentRequestCard key={el.user._id} user={el.user} />
          ) : el.type == "friendRequest" ? (
            <FriendRequestCard key={el.user._id} user={el.user} />
          ) : el.type == "friend" ? (
            <FriendCard key={el.user._id} user={el.user} />
          ) : null
        )}
    </div>
  );
};
