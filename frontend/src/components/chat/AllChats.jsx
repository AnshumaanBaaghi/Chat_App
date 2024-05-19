import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Chat } from "./Chat";
import { HiUserGroup } from "react-icons/hi2";
import { FaCircleUser } from "react-icons/fa6";
import { ReactIcon } from "../ReactIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popup } from "../Popup";
import { useSelector } from "react-redux";

export const AllChats = () => {
  const allChats = useSelector((state) => state.user.chats);
  const loggedinUser = useSelector((state) => state.user.userDetail);
  return (
    <div className="w-2/6  h-screen box-border bg-slate-500  flex flex-col gap-2">
      <div className="px-3 flex justify-between">
        <div>
          <ReactIcon color="white" size="36px">
            <FaCircleUser />
          </ReactIcon>
        </div>
        <div>
          <Dialog>
            <DialogTrigger>
              <ReactIcon size="36px">
                <HiUserGroup />
              </ReactIcon>
            </DialogTrigger>
            <DialogContent>
              <Popup />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex bg-white px-3 py-2 mx-3 rounded-2xl items-center gap-2">
        <IoSearchOutline className="text-xl" />
        <input
          className="w-full  outline-none"
          type="text"
          placeholder="Search..."
        />
      </div>
      <div className="bg-slate-300 py-3">
        {allChats.length > 0 &&
          allChats.map((el) => (
            <Chat key={el._id} chat={el} loggedinUser={loggedinUser} />
          ))}
      </div>
    </div>
  );
};
