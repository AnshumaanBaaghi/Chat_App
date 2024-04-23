import React from "react";

export const Messages = () => {
  return (
    <div className="flex flex-col gap-4 bg-red-400 ">
      <div className="text-center">Today</div>
      <div className="flex">
        <p className="max-w-[60%] bg-blue-300 p-2">hello</p>
      </div>
      <div className="flex justify-end">
        <p className="max-w-[60%] bg-blue-300 text-right p-2">ha bhai</p>
      </div>
    </div>
  );
};
