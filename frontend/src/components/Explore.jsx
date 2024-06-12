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
  onClickOnFriend,
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
      {friends &&
        friends.map((el) => (
          <FriendCard
            key={el.userId}
            user={el}
            onClickCallbackFunction={onClickOnFriend}
          />
        ))}
      {newUsers?.length == 0 &&
        sentRequests?.length == 0 &&
        friendRequests?.length == 0 &&
        friends?.length == 0 && <>Nothing to Explore</>}
    </div>
  );
};
