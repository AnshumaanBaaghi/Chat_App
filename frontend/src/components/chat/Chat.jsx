import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactIcon } from "../ReactIcon";
import { FaCircleUser } from "react-icons/fa6";
import { RiGroupLine } from "react-icons/ri";
import { getOppositeUserDetails } from "@/utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedChat } from "@/redux/actions/userActions";

export const Chat = ({
  chat,
  loggedinUser,
  isSomeOneTyping,
  handleSelectChat,
}) => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.user.selectedChat);
  console.log("chat.isGroup.avatar:", chat);

  const getTwoLetters = () => {
    const name = getOppositeUserDetails(
      loggedinUser,
      chat.participants
    ).name.split(" ");
    const l1 = name[0][0];
    const l2 = (name[1] && name[1][0]) || name[0][1];
    return (l1 + l2).toUpperCase();
  };

  return (
    <div className="px-3">
      <div
        className="flex gap-3 cursor-pointer border-b border-b-[#959cb647] py-3"
        onClick={() => handleSelectChat(chat)}
      >
        <Avatar size="3.5rem">
          <AvatarImage
            src={
              chat.isGroup
                ? chat.avatar
                : getOppositeUserDetails(loggedinUser, chat.participants).avatar
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
        <div className="box-border flex flex-col w-full justify-between ">
          <div className="flex justify-between  items-center">
            <h4 className="font-semibold text-white">
              {chat.isGroup
                ? chat.name
                : getOppositeUserDetails(loggedinUser, chat.participants).name}
            </h4>
            <p className="text-xs text-white">1:20 PM</p>
          </div>
          <div className="flex justify-between  items-center">
            <p className="text-sm text-[#9a9cae]">
              {isSomeOneTyping
                ? `${
                    chat.isGroup ? isSomeOneTyping.name + " is " : ""
                  }typing...`
                : chat?.latestMessage?.content || "Tap to Chat"}
            </p>
            <p className="w-6 h-6 rounded-full text-white bg-[#00a261] text-xs flex items-center justify-center">
              1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
