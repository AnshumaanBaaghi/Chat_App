import { FriendCard } from "@/components/card/friendCard";

export const Friends = ({ arr, onClickOnFriend }) => {
  return (
    <div>
      {arr?.length > 0 ? (
        arr.map((el) => (
          <FriendCard
            key={el.userId}
            user={el}
            onClickCallbackFunction={onClickOnFriend}
          />
        ))
      ) : (
        <>No Friends </>
      )}
    </div>
  );
};
