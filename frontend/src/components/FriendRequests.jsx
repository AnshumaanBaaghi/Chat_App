import React, { useState } from "react";
import { FriendRequestCard } from "@/components/card/friendRequestCard";
import { Input } from "@/components/ui/input";
import { getFilteredArray } from "@/utils/functions";

export const FriendRequests = ({ arr }) => {
  const [query, setQuery] = useState("");
  return (
    <div>
      <Input onChange={(e) => setQuery(e.target.value)} />
      {arr &&
        getFilteredArray(query, arr).map((el) => (
          <FriendRequestCard key={el.userId} user={el} />
        ))}
    </div>
  );
};
