import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Chat } from "./Chat";
import { HiUserGroup } from "react-icons/hi2";
import { FaCircleUser } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
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
import { CreateGroupChat } from "../createGroupChat";

export const AllChats = ({ typingUsersObject }) => {
  const allChats = useSelector((state) => state.user.chats);
  const loggedinUser = useSelector((state) => state.user.userDetail);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  return (
    <div className="w-2/6  h-screen box-border bg-slate-500  flex flex-col gap-2 relative">
      <div className="px-3 flex justify-between">
        <div>
          <ReactIcon color="white" size="36px">
            <FaCircleUser />
          </ReactIcon>
        </div>
        <div className="flex justify-between items-center gap-3">
          <ReactIcon color="black" size="36px">
            <GoPlus onClick={() => setShowCreateGroupModal(true)} />
          </ReactIcon>

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
            <Chat
              key={el._id}
              chat={el}
              loggedinUser={loggedinUser}
              isSomeOneTyping={typingUsersObject[el._id]}
            />
          ))}
      </div>
      <div
        className={`w-full bg-blue-600 absolute h-screen  duration-500 ${
          showCreateGroupModal ? "left-0" : "-left-full"
        }`}
      >
        {showCreateGroupModal && (
          <CreateGroupChat setShowCreateGroupModal={setShowCreateGroupModal} />
        )}
      </div>
    </div>
  );
};
