import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Chat } from "./Chat";

export const AllChats = () => {
  return (
    <div className="w-2/6  h-screen box-border bg-slate-500  flex flex-col gap-2">
      <div className="px-3">options</div>
      <div className="flex bg-white px-3 py-2 mx-3 rounded-2xl items-center gap-2">
        <IoSearchOutline className="text-xl" />
        <input
          className="w-full  outline-none"
          type="text"
          placeholder="Search..."
        />
      </div>
      <div className="bg-slate-300 py-3">
        <Chat />
        <Chat />
      </div>
    </div>
  );
};
