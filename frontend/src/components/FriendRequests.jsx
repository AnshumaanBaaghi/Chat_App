import React, { useState } from "react";
import { FriendRequestCard } from "@/components/card/friendRequestCard";
import { getFilteredArray } from "@/utils/functions";

export const FriendRequests = ({ arr }) => {
  const [query, setQuery] = useState("");
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
