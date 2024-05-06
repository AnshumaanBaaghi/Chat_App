import { FriendCard } from "@/components/card/friendCard";

export const Friends = ({ arr }) => {
  return (
    <div>
      {arr?.length > 0 ? (
        arr.map((el) => <FriendCard key={el.userId} user={el} />)
      ) : (
        <>No Friends </>
      )}
    </div>
  );
};
