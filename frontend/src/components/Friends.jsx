import React, { useState } from "react";
import { FriendCard } from "@/components/card/friendCard";
import { getFilteredArray } from "@/utils/functions";

export const Friends = ({ arr }) => {
  const [query, setQuery] = useState("");
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
