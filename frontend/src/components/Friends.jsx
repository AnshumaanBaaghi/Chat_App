import { FriendCard } from "@/components/card/friendCard";

export const Friends = ({ arr, onClickOnFriend }) => {
  return (
    <div className="flex flex-col gap-1">
      {arr?.length > 0 ? (
        arr.map((el) => (
          <div className="text-[#ffffffed] hover:bg-[#1b1b1b] rounded-md">
            <FriendCard
              key={el._id}
              user={el}
              onClickCallbackFunction={onClickOnFriend}
            />
          </div>
        ))
      ) : (
        <p className="text-center text-[#ffffffd6]">No Friends</p>
      )}
    </div>
  );
};
