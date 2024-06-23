import { FriendRequestCard } from "@/components/card/friendRequestCard";
import { acceptFriendRequest } from "@/socket";
import { useSelector } from "react-redux";

export const FriendRequests = ({ arr }) => {
  const socket = useSelector((state) => state.socket.socket);

  return (
    <div className="flex flex-col gap-1">
      {arr?.length > 0 ? (
        arr.map((el) => (
          <div className="text-[#ffffffed] hover:bg-[#1b1b1b] rounded-md">
            <FriendRequestCard
              key={el._id}
              user={el}
              socket={socket}
              acceptFriendRequest={acceptFriendRequest}
            />
          </div>
        ))
      ) : (
        <p className="text-center text-[#ffffffd6]">No Pending Request</p>
      )}
    </div>
  );
};
