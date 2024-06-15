import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactIcon } from "../ReactIcon";
import { FaCircleUser } from "react-icons/fa6";
import { getOppositeUserDetails } from "@/utils/functions";

export const Chat = ({
  chat,
  loggedinUser,
  isSomeOneTyping,
  handleSelectChat,
  isAnyUnreadMessages,
  isChatSelected,
  time,
  isOnline,
}) => {
  const getTwoLetters = () => {
    const name = getOppositeUserDetails(
      loggedinUser,
      chat.participants
    ).name.split(" ");
    const l1 = name[0][0];
    const l2 = (name[1] && name[1][0]) || name[0][1] || "";
    return (l1 + l2).toUpperCase();
  };

  return (
    // TODO: Add Styling to selected Chat
    <div className={`px-3 box-border w-full  relative`}>
      <div
        className={`flex gap-3 cursor-pointer border-b border-b-[#959cb647] py-3 box-border overflow-hidden px-3 ${
          isChatSelected ? "bg-[#222020]" : "hover:bg-[#1b1b1b]"
        }`}
        onClick={() => handleSelectChat(chat)}
      >
        <div className="relative">
          <Avatar size="3.5rem" className="relative">
            <AvatarImage
              src={
                chat.isGroup
                  ? chat.avatar
                  : getOppositeUserDetails(loggedinUser, chat.participants)
                      .avatar
              }
            />
            <AvatarFallback>
              {chat.isGroup ? (
                <ReactIcon color="gray" size="100%">
                  <FaCircleUser />
                </ReactIcon>
              ) : (
                getTwoLetters()
              )}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="onlineStatusIndicator absolute bottom-1 right-1"></div>
          )}
        </div>
        <div className="box-border flex flex-col w-full justify-between ">
          <div
            className="grid justify-between  items-center"
            style={{ gridTemplateColumns: "80% 15%" }}
          >
            <h4 className="font-semibold text-white overflow-hidden text-ellipsis whitespace-nowrap">
              {chat.isGroup
                ? chat.name
                : getOppositeUserDetails(loggedinUser, chat.participants).name}
            </h4>
            {time && (
              <p
                className={`text-xs flex justify-end ${
                  isAnyUnreadMessages ? "text-green-400" : "text-[#9a9cae]"
                } `}
              >
                {time}
              </p>
            )}
          </div>
          <div
            className="grid justify-between w-full  items-center box-border"
            style={{ gridTemplateColumns: "88% 10%" }}
          >
            <p
              className={`text-sm ${
                isAnyUnreadMessages ? "text-white" : "text-[#9a9cae]"
              } overflow-hidden text-ellipsis whitespace-nowrap`}
            >
              {isSomeOneTyping ? (
                <span className="text-[#00a261] text-[13px]">
                  {chat.isGroup
                    ? `${isSomeOneTyping.name} is typing...`
                    : "typing..."}
                </span>
              ) : chat?.latestMessage?.content ? (
                chat.isGroup ? (
                  `${
                    chat.latestMessage.sender._id === loggedinUser.userId
                      ? "You"
                      : chat.latestMessage.sender.name
                  }: ${chat.latestMessage.content}`
                ) : (
                  chat.latestMessage.content
                )
              ) : (
                "Tap to Chat"
              )}
            </p>
            <div className="flex justify-end">
              {isAnyUnreadMessages && (
                <p className="w-6 h-6 rounded-full text-white bg-green-500 text-xs flex items-center justify-center">
                  {isAnyUnreadMessages}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
