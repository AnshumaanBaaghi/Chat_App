import React, { useState } from "react";
import { FriendCard } from "@/components/card/friendCard";
import { Input } from "@/components/ui/input";
import { getFilteredArray } from "@/utils/functions";

export const Friends = ({ arr }) => {
  const [query, setQuery] = useState("");

  return (
    <div>
      <Input onChange={(e) => setQuery(e.target.value)} />
      {arr &&
        getFilteredArray(query, arr).map((el) => (
          <FriendCard key={el.userId} user={el} />
        ))}
    </div>
  );
};
