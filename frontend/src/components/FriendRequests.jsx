import React from "react";

export const FriendRequests = ({ arr }) => {
  console.log("arr:", arr);
  return (
    <div>
      {arr &&
        arr.map((el) => (
          <div
            key={el._id}
            className="flex justify-between items-center border border-red-300 py-2 px-3"
          >
            <div>{el.name}</div>
            <button className="bg-blue-300 py-1 px-3 rounded-md">Accept</button>
          </div>
        ))}
    </div>
  );
};
