import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Chat } from "./Chat";
import { HiUserGroup } from "react-icons/hi2";
import { FaCircleUser } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { ReactIcon } from "../ReactIcon";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  getOppositeUserDetails,
  timeConverter,
} from "@/utils/functions";
import Tooltip from "../ui/tooltip";
import { Button } from "../ui/button";

export const AllChats = ({
  typingUsersObject,
  selectedChat,
  unreadMessages,
  onlineUsers,
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

  const closePopup = () => {
    document.getElementById("popupCloseButton").click();
  };

  useEffect(() => {
    setChatsArray(getFilteredChatArray(query, chats, loggedinUser));
  }, [query, chats]);

  return (
    <div
      className={`w-full md:w-2/6 md:flex no-select ${
        selectedChat ? "hidden" : "flex"
      }  h-screen border-[#1f212a] box-border flex-col relative`}
    >
      {/* bg-[#0d0e12] */}
      <div className="p-3 flex justify-between bg-[#0d0e12]">
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
              <Popup
                closePopup={closePopup}
                chats={chats}
                loggedinUser={loggedinUser}
                handleSelectChat={handleSelectChat}
              />
              <DialogClose asChild>
                <span className="hidden" id="popupCloseButton"></span>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="bg-[#0d0e12] px-3 py-2 ">
        <div className="flex bg-[#15171c] px-3 py-2  rounded-xl items-center gap-2 border border-[#85818173]">
          <IoSearchOutline className="text-xl text-[#b8b3b3]" />
          <input
            className="w-full h-5 outline-none bg-transparent text-[#b8b3b3] bottom-0"
            type="text"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className=" bg-[#0d0e12] flex-grow">
        <div className="bg-[#0d0e12] h-full py-3">
          {chats.length > 0 &&
            chatsArray.map((el, index) => {
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
                  isOnline={
                    !el.isGroup &&
                    onlineUsers &&
                    onlineUsers[
                      getOppositeUserDetails(loggedinUser, el.participants)._id
                    ]
                  }
                />
              );
            })}
        </div>
      </ScrollArea>
      {/* <div className="flex-grow bg-red-200">
      </div> */}
      <div
        className={`w-full bg-gray-600 absolute h-screen  duration-500 ${
          showCreateGroupModal || showUserProfileSidebar
            ? "left-0"
            : "-left-full"
        }`}
      >
        {showCreateGroupModal ? (
          <CreateGroupChat
            setShowCreateGroupModal={setShowCreateGroupModal}
            chats={chats}
          />
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
