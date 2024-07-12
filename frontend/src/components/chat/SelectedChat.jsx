import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Messages } from "@/components/chat/Messages";
import { useDispatch, useSelector } from "react-redux";
import {
  getOppositeUserDetails,
  rearangeParticipants,
} from "@/utils/functions";
import {
  getAllMessages,
  initialiseVc_api,
  removeUnreadMessage_api,
  sendMessage,
} from "@/api";
import {
  updateChats,
  updateSelectedChat,
  updateUnreadMessages,
} from "@/redux/actions/userActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactIcon } from "../ReactIcon";
import { FaArrowLeft, FaCircleUser } from "react-icons/fa6";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { v4 } from "uuid";
import { IoVideocam } from "react-icons/io5";

export const SelectedChat = ({
  handleTypingMessageChange,
  messages,
  setMessages,
  typingUsersObject,
  handleStopTyping,
  unreadMessages,
  onlineUsers,
  setIsOnCall,
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

  const onEmojiSelect = (e) => {
    setTypedMessages((pre) => pre + e.native);
    handleTypingMessageChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      chatId: selectedChat._id,
      attachents: [], //
      content: typedMessages,
      createdAt: new Date().toISOString(),
      sender: loggedinUser,
      updatedAt: new Date().toISOString(),
      _id: v4(), // Generate a unique ID for the message
    };
    setMessages((pre) => [...pre, newMessage]);
    const updatedChats = chats.reduce((acc, el) => {
      if (el._id === selectedChat._id) {
        const updatedChat = { ...el, latestMessage: newMessage };
        return [updatedChat, ...acc];
      }
      return [...acc, el];
    }, []);
    dispatch(updateChats(updatedChats));
    setTypedMessages("");
    handleStopTyping(selectedChat);
    try {
      const res = await sendMessage(selectedChat._id, typedMessages);
      if (!res.data?.data) return; //TODO: Add toast
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

  const handleVC = async () => {
    try {
      // TODO: check media permission first
      await initialiseVc_api(selectedChat._id);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;
    setShowTapToInfoMessage(true);
    setNoOfUnreadMessage(null);
    getMessages();
    inputRef.current?.focus();
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
      } md:w-4/6 md:block border-l border-l-[#1f212a] fullHeight relative`}
    >
      {selectedChat ? (
        <div>
          {/* Heading */}
          {/* TODO: Have to Fix Header and footer */}
          <div className="w-full md:w-4/6 h-16 fixed top-0 bg-[#0d0e12] flex gap-3 justify-between items-center p-3 cursor-pointer no-select border-b border-b-[#1f212a]">
            <div
              className="flex gap-5 items-center w-full text-white"
              onClick={openChatDetailSheet}
            >
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
                  src={
                    selectedChat.isGroup
                      ? selectedChat.avatar
                      : getOppositeUserDetails(
                          loggedinUser,
                          selectedChat.participants
                        ).avatar
                  }
                />
                <AvatarFallback>
                  {selectedChat.isGroup ? (
                    // TODO: Change Fallback for Group Chat
                    <ReactIcon color="gray" size="100%">
                      <FaCircleUser />
                    </ReactIcon>
                  ) : (
                    <ReactIcon color="gray" size="100%">
                      <FaCircleUser />
                    </ReactIcon>
                  )}
                </AvatarFallback>
              </Avatar>
              <span
                className="grid pr-3 cursor-pointer"
                style={{
                  gridTemplateColumns: "100%",
                }}
              >
                <h4 className="overflow-hidden text-ellipsis whitespace-nowrap ">
                  {selectedChat?.isGroup
                    ? selectedChat.name
                    : getOppositeUserDetails(
                        loggedinUser,
                        selectedChat.participants
                      ).name}
                </h4>
                {someoneTyping ? (
                  <div className="text-green-400 text-[13px]">typing...</div>
                ) : showTapToInfoMessage ? (
                  <div className="text-[13px] ">
                    Click here for {selectedChat.isGroup ? "Group" : "Contact"}{" "}
                    info
                  </div>
                ) : selectedChat.isGroup ? (
                  <div className="text-[13px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {rearangeParticipants(
                      loggedinUser,
                      selectedChat.admin,
                      selectedChat.participants
                    )
                      .map((el, index) => (index === 0 ? "You" : el.name))
                      .join(", ")}
                  </div>
                ) : (
                  onlineUsers &&
                  onlineUsers[
                    getOppositeUserDetails(
                      loggedinUser,
                      selectedChat.participants
                    )._id
                  ] && (
                    <div className="text-[13px] overflow-hidden text-ellipsis whitespace-nowrap text-green-400">
                      online
                    </div>
                  )
                )}
              </span>
            </div>
            <div
              className="mr-2 p-2 rounded-full hover:bg-slate-700"
              onClick={handleVC}
            >
              <ReactIcon color="white" size="28px">
                <IoVideocam />
              </ReactIcon>
            </div>
          </div>
          {/* Chats */}
          <ScrollArea
            className="py-4 px-9 absolute top-16 bottom-16 bg-[#15171c] flex items-end"
            style={{ height: "calc(100svh - 128px)" }}
          >
            <Messages
              messages={messages}
              isGroup={selectedChat?.isGroup}
              noOfUnreadMessage={noOfUnreadMessage}
              selectedChat={selectedChat}
            />
          </ScrollArea>
          <div className="h-16 fixed w-full md:w-4/6 bottom-0 bg-[#0d0e12] border-t border-t-[#1f212a] flex px-3 gap-3 items-center">
            <Popover>
              <PopoverTrigger>
                <ReactIcon color="gray" size="2.3rem">
                  <MdOutlineEmojiEmotions />
                </ReactIcon>
              </PopoverTrigger>
              <PopoverContent className="bg-transparent border-0">
                <Picker data={data} onEmojiSelect={onEmojiSelect} />
              </PopoverContent>
            </Popover>

            <form onSubmit={handleSubmit} className="flex w-full gap-3">
              <input
                type="text"
                className="h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm shadow-sm outline-stone-800 border border-[#1f212a] text-white"
                placeholder="Type a message"
                value={typedMessages}
                onChange={handleChange}
                ref={inputRef}
              />
              <Button type="submit" variant="secondary">
                send
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-white w-full fullHeight flex items-center justify-center">
          Select Chat to Start Conversation
        </div>
      )}
    </div>
  );
};
