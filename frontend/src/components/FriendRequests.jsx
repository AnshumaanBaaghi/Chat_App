import { FriendRequestCard } from "@/components/card/friendRequestCard";
import { acceptFriendRequest } from "@/socket";
import { useSelector } from "react-redux";

export const FriendRequests = ({ arr }) => {
  const socket = useSelector((state) => state.socket.socket);

  return (
    <div>
      {arr?.length > 0 ? (
        arr.map((el) => (
          <FriendRequestCard
            key={el.userId}
            user={el}
            socket={socket}
            acceptFriendRequest={acceptFriendRequest}
          />
        ))
      ) : (
        <>No Pending Request</>
      )}
    </div>
  );
};
