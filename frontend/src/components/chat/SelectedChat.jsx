import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Messages } from "@/components/chat/Messages";
import { useDispatch, useSelector } from "react-redux";
import {
  getOppositeUserDetails,
  rearangeParticipants,
} from "@/utils/functions";
import { getAllMessages, removeUnreadMessage_api, sendMessage } from "@/api";
import {
  updateChats,
  updateSelectedChat,
  updateUnreadMessages,
} from "@/redux/actions/userActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactIcon } from "../ReactIcon";
import { FaArrowLeft, FaCircleUser } from "react-icons/fa6";
import { MdOutlineEmojiEmotions } from "react-icons/md";

export const SelectedChat = ({
  handleTypingMessageChange,
  messages,
  setMessages,
  typingUsersObject,
  handleStopTyping,
  unreadMessages,
}) => {
  const selectedChat = useSelector((state) => state.user.selectedChat);
  const loggedinUser = useSelector((state) => state.user.userDetail);
  const chats = useSelector((state) => state.user.chats);
  const dispatch = useDispatch();

  const inputRef = useRef(null);

  const [typedMessages, setTypedMessages] = useState("");
  const [someoneTyping, setSomeoneTyping] = useState(null);
  const [showTapToInfoMessage, setShowTapToInfoMessage] = useState(false);
  const [noOfUnreadMessage, setNoOfUnreadMessage] = useState(null);

  const handleChange = (e) => {
    setTypedMessages(e.target.value);
    handleTypingMessageChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTypedMessages("");
    handleStopTyping(selectedChat);
    try {
      const res = await sendMessage(selectedChat._id, typedMessages);
      if (!res.data?.data) return;
      setMessages((pre) => [...pre, res.data.data]);
      const updatedChats = chats.reduce((acc, el) => {
        if (el._id === selectedChat._id) {
          const updatedChat = { ...el, latestMessage: res.data.data };
          return [updatedChat, ...acc];
        }
        return [...acc, el];
      }, []);
      dispatch(updateChats(updatedChats));
    } catch (error) {
      console.log("error:", error);
    }
  };

  const getMessages = async () => {
    setMessages([]);
    try {
      const res = await getAllMessages(selectedChat._id);
      setMessages(res.data?.data || []);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const checkTyperInCurrentChat = () => {
    if (typingUsersObject[selectedChat?._id]) {
      setSomeoneTyping(typingUsersObject[selectedChat._id]);
      return;
    }
    setSomeoneTyping(null);
  };

  const unSelectChat = () => {
    dispatch(updateSelectedChat(null));
  };

  const openChatDetailSheet = () => {
    document.getElementById("openChatDetailSheet").click();
  };

  const removeUnreadMessage = async () => {
    try {
      await removeUnreadMessage_api(selectedChat._id);
      const updatedUnreadMessages = { ...unreadMessages };
      delete updatedUnreadMessages[selectedChat._id];
      dispatch(updateUnreadMessages(updatedUnreadMessages));
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;
    setShowTapToInfoMessage(true);
    setNoOfUnreadMessage(null);
    getMessages();
    inputRef.current.focus();
    const timerId = setTimeout(() => {
      setShowTapToInfoMessage(false);
    }, 3000);
    if (unreadMessages[selectedChat._id]) {
      setNoOfUnreadMessage(unreadMessages[selectedChat._id]);
      removeUnreadMessage();
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [selectedChat]);

  useEffect(() => {
    checkTyperInCurrentChat();
  }, [typingUsersObject]);

  return (
    <div
      className={`bg-[#15171c] w-full  ${
        selectedChat ? "block" : "hidden"
      } md:w-4/6 md:block border-l border-l-[#1f212a]`}
    >
      {selectedChat ? (
        <div>
          {/* Heading */}

          <div
            onClick={openChatDetailSheet}
            className="w-full h-16 bg-[#0d0e12] flex justify-between items-center p-3 cursor-pointer"
          >
            <div className="flex gap-5 items-center text-white">
              <div
                className={`${selectedChat ? "block" : "hidden"} md:hidden`}
                onClick={unSelectChat}
              >
                <ReactIcon color="gray" size="30px">
                  <FaArrowLeft />
                </ReactIcon>
              </div>
              <Avatar size="2.5rem" className="cursor-pointer">
                <AvatarImage
                  src={selectedChat.isGroup ? selectedChat.avatar : ""}
                />
                <AvatarFallback>
                  {selectedChat.isGroup ? (
                    <ReactIcon color="gray" size="100%">
                      <FaCircleUser />
                    </ReactIcon>
                  ) : (
                    "Group"
                  )}
                </AvatarFallback>
              </Avatar>
              <span
                className="grid pr-3  transition-opacity transition-transform duration-300 cursor-pointer"
                style={{
                  gridTemplateColumns: "100%",
                }}
              >
                <h4 className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {selectedChat?.isGroup
                    ? selectedChat.name
                    : getOppositeUserDetails(
                        loggedinUser,
                        selectedChat.participants
                      ).name}
                </h4>
                {someoneTyping ? (
                  <div className="text-[#00a261] text-[13px]">typing...</div>
                ) : showTapToInfoMessage ? (
                  <div className="text-[13px]">
                    Click here for {selectedChat.isGroup ? "Group" : "Contact"}{" "}
                    info
                  </div>
                ) : (
                  selectedChat.isGroup && (
                    <div className="text-[13px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {rearangeParticipants(
                        loggedinUser,
                        selectedChat.admin,
                        selectedChat.participants
                      )
                        .map((el, index) => (index === 0 ? "You" : el.name))
                        .join(", ")}
                    </div>
                  )
                )}
              </span>
            </div>
            <div className=""></div>
          </div>
          {/* Chats */}
          <ScrollArea
            className="py-4 px-9 bg-[#212728] flex items-end"
            style={{ height: "calc(100vh - 128px)" }}
          >
            <Messages
              messages={messages}
              isGroup={selectedChat?.isGroup}
              noOfUnreadMessage={noOfUnreadMessage}
              selectedChat={selectedChat}
            />
          </ScrollArea>
          <div className="h-16 bg-gray flex px-3 gap-3 items-center">
            <ReactIcon color="gray" size="2.3rem">
              <MdOutlineEmojiEmotions />
            </ReactIcon>
            <form onSubmit={handleSubmit} className="flex w-full gap-3">
              <input
                type="text"
                className="h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-sm outline-stone-800 border border-[#1f212a] text-white"
                placeholder="Type a message"
                value={typedMessages}
                onChange={handleChange}
                ref={inputRef}
              />
              <button type="submit" className="bg-red-500">
                send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-white w-full h-screen flex items-center justify-center">
          Select Chat to Start Conversation
        </div>
      )}
    </div>
  );
};
