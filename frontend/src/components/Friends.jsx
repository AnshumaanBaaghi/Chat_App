import React from "react";
import { FriendCard } from "@/components/card/friendCard";

export const Friends = ({ arr }) => {
  return (
    <div>
      {arr && arr.map((el) => <FriendCard key={el.userId} user={el} />)}
    </div>
  );
};
