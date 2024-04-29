import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NewUserCard } from "@/components/card/newUserCard";
import { SentRequestCard } from "@/components/card/sentRequestCard";
import { FriendRequestCard } from "@/components/card/friendRequestCard";
import { FriendCard } from "@/components/card/friendCard";
import { sendFriendRequest } from "@/socket";

export const Explore = ({ arr }) => {
  console.log("arr explore:", arr);
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.user.userDetail);

  return (
    <div>
      {arr &&
        arr.map((el) =>
          el.type == "newUser" ? (
            <NewUserCard
              key={el.user.userId}
              socket={socket}
              user={el.user}
              loggedInUser_id={user.userId}
              sendFriendRequest={sendFriendRequest}
            />
          ) : el.type == "sentRequest" ? (
            <SentRequestCard key={el.user.userId} user={el.user} />
          ) : el.type == "friendRequest" ? (
            <FriendRequestCard key={el.user.userId} user={el.user} />
          ) : el.type == "friend" ? (
            <FriendCard key={el.user.userId} user={el.user} />
          ) : null
        )}
    </div>
  );
};
