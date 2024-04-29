import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NewUserCard } from "@/components/card/newUserCard";
import { SentRequestCard } from "@/components/card/sentRequestCard";
import { FriendRequestCard } from "@/components/card/friendRequestCard";
import { FriendCard } from "@/components/card/friendCard";
import { acceptFriendRequest, sendFriendRequest } from "@/socket";

export const Explore = ({
  newUsers,
  friends,
  sentRequests,
  friendRequests,
}) => {
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.user.userDetail);

  return (
    <div>
      {newUsers &&
        newUsers.map((el) => (
          <NewUserCard
            key={el.userId}
            socket={socket}
            user={el}
            loggedInUser_id={user.userId}
            sendFriendRequest={sendFriendRequest}
          />
        ))}
      {friends && friends.map((el) => <FriendCard key={el.userId} user={el} />)}
      {sentRequests &&
        sentRequests.map((el) => <SentRequestCard key={el.userId} user={el} />)}
      {friendRequests &&
        friendRequests.map((el) => (
          <FriendRequestCard
            key={el.userId}
            user={el}
            socket={socket}
            acceptFriendRequest={acceptFriendRequest}
          />
        ))}
    </div>
  );
};
