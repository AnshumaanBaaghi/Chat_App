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
    <div className="flex flex-col gap-1">
      {newUsers &&
        newUsers.map((el) => (
          <div className="text-[#ffffffed] hover:bg-[#1b1b1b] rounded-md">
            <NewUserCard
              key={el.userId}
              socket={socket}
              user={el}
              loggedInUser_id={user.userId}
              sendFriendRequest={sendFriendRequest}
            />
          </div>
        ))}
      {sentRequests &&
        sentRequests.map((el) => (
          <div className="text-[#ffffffed] hover:bg-[#1b1b1b] rounded-md">
            <SentRequestCard key={el.userId} user={el} />
          </div>
        ))}
      {friendRequests &&
        friendRequests.map((el) => (
          <div className="text-[#ffffffed] hover:bg-[#1b1b1b] rounded-md">
            <FriendRequestCard
              key={el.userId}
              user={el}
              socket={socket}
              acceptFriendRequest={acceptFriendRequest}
            />
          </div>
        ))}
      {friends &&
        friends.map((el) => (
          <div className="text-[#ffffffed] hover:bg-[#1b1b1b] rounded-md">
            <FriendCard
              key={el.userId}
              user={el}
              onClickCallbackFunction={onClickOnFriend}
            />
          </div>
        ))}
      {newUsers?.length == 0 &&
        sentRequests?.length == 0 &&
        friendRequests?.length == 0 &&
        friends?.length == 0 && (
          <p className="text-center text-[#ffffffd6]">Nothing to Explore</p>
        )}
    </div>
  );
};
