import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Chat } from "./Chat";
import { HiUserGroup } from "react-icons/hi2";
import { FaCircleUser } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { ReactIcon } from "../ReactIcon";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popup } from "../Popup";
import { useDispatch, useSelector } from "react-redux";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateGroupChat } from "../createGroupChat";
import { UserProfileSidebar } from "../UserProfileSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateSelectedChat } from "@/redux/actions/userActions";
import {
  dateConverter,
  getFilteredChatArray,
  timeConverter,
} from "@/utils/functions";
import Tooltip from "../ui/tooltip";

export const AllChats = ({
  typingUsersObject,
  selectedChat,
  unreadMessages,
}) => {
  const chats = useSelector((state) => state.user.chats);
  const loggedinUser = useSelector((state) => state.user.userDetail);

  const [query, setQuery] = useState("");
  const [chatsArray, setChatsArray] = useState([]);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showUserProfileSidebar, setShowUserProfileSidebar] = useState(false);
  const dispatch = useDispatch();

  const handleSelectChat = (chat) => {
    if (selectedChat && selectedChat._id === chat._id) return; // Avoid Selecting Same Chat
    dispatch(updateSelectedChat(chat));
  };

  useEffect(() => {
    setChatsArray(getFilteredChatArray(query, chats, loggedinUser));
  }, [query, chats]);

  return (
    <div
      className={`w-full md:w-2/6 md:flex no-select ${
        selectedChat ? "hidden" : "flex"
      }  h-screen bg-[#0d0e12] border-[#1f212a] box-border flex-col flex-w gap-4 relative`}
    >
      <div className="px-3 mt-3 flex justify-between">
        <div>
          <Tooltip content="Profile">
            <Avatar
              className="bg-black"
              size="2.5rem"
              onClick={() => setShowUserProfileSidebar(true)}
            >
              <AvatarImage src={loggedinUser.avatar} />
              <AvatarFallback className="bg-black">
                <ReactIcon className="bg-transparent" color="white" size="100%">
                  <FaCircleUser />
                </ReactIcon>
              </AvatarFallback>
            </Avatar>
          </Tooltip>
        </div>
        <div className="flex justify-between items-center gap-3">
          <Tooltip content="Create Group">
            <ReactIcon color="white" size="36px">
              <GoPlus onClick={() => setShowCreateGroupModal(true)} />
            </ReactIcon>
          </Tooltip>
          <Dialog>
            <DialogTrigger>
              <Tooltip content="Explore">
                <ReactIcon size="36px" color="white">
                  <HiUserGroup />
                </ReactIcon>
              </Tooltip>
            </DialogTrigger>
            <DialogContent>
              <Popup />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex bg-white px-3 py-2 mx-3 rounded-xl items-center gap-2">
        <IoSearchOutline className="text-xl" />
        <input
          className="w-full h-5  outline-none"
          type="text"
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ScrollArea>
        <div className="bg-[#0d0e12]  mx-3 py-3  rounded-xl flex-grow">
          {chats.length > 0 &&
            chatsArray.map((el) => {
              const day =
                el.latestMessage && dateConverter(el.latestMessage.updatedAt);
              return (
                <Chat
                  key={el._id}
                  chat={el}
                  loggedinUser={loggedinUser}
                  handleSelectChat={handleSelectChat}
                  isSomeOneTyping={typingUsersObject[el._id]}
                  isAnyUnreadMessages={unreadMessages[el._id]}
                  time={
                    day && day === "Today"
                      ? timeConverter(el.latestMessage.updatedAt)
                      : day
                  }
                />
              );
            })}
        </div>
      </ScrollArea>
      <div
        className={`w-full bg-blue-600 absolute h-screen  duration-500 ${
          showCreateGroupModal || showUserProfileSidebar
            ? "left-0"
            : "-left-full"
        }`}
      >
        {showCreateGroupModal ? (
          <CreateGroupChat setShowCreateGroupModal={setShowCreateGroupModal} />
        ) : (
          showUserProfileSidebar && (
            <UserProfileSidebar
              setShowUserProfileSidebar={setShowUserProfileSidebar}
            />
          )
        )}
      </div>
    </div>
  );
};
