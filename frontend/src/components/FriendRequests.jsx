import { FriendRequestCard } from "@/components/card/friendRequestCard";

export const FriendRequests = ({ arr }) => {
  return (
    <div>
      {arr?.length > 0 ? (
        arr.map((el) => <FriendRequestCard key={el.userId} user={el} />)
      ) : (
        <>No Pending Request</>
      )}
    </div>
  );
};
