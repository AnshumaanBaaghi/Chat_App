import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NewUserCard } from "@/components/card/newUserCard";
import { SentRequestCard } from "@/components/card/sentRequestCard";
import { FriendRequestCard } from "@/components/card/friendRequestCard";
import { FriendCard } from "@/components/card/friendCard";
import { acceptFriendRequest, sendFriendRequest } from "@/socket";
import { Input } from "@/components/ui/input";
import { getFilteredArray } from "@/utils/functions";

export const Explore = ({
  newUsers,
  friends,
  sentRequests,
  friendRequests,
}) => {
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.user.userDetail);
  const [query, setQuery] = useState("");

  return (
    <div>
      <Input onChange={(e) => setQuery(e.target.value)} />
      {newUsers &&
        getFilteredArray(query, newUsers).map((el) => (
          <NewUserCard
            key={el.userId}
            socket={socket}
            user={el}
            loggedInUser_id={user.userId}
            sendFriendRequest={sendFriendRequest}
          />
        ))}
      {sentRequests &&
        getFilteredArray(query, sentRequests).map((el) => (
          <SentRequestCard key={el.userId} user={el} />
        ))}
      {friendRequests &&
        getFilteredArray(query, friendRequests).map((el) => (
          <FriendRequestCard
            key={el.userId}
            user={el}
            socket={socket}
            acceptFriendRequest={acceptFriendRequest}
          />
        ))}
      {friends &&
        getFilteredArray(query, friends).map((el) => (
          <FriendCard key={el.userId} user={el} />
        ))}
    </div>
  );
};
