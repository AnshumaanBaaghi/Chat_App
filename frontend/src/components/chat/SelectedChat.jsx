import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Messages } from "@/components/chat/Messages";
import { useDispatch, useSelector } from "react-redux";
import { getOppositeUserDetails } from "@/utils/functions";
import { getAllMessages, sendMessage } from "@/api";
import { updateChats, updateSelectedChat } from "@/redux/actions/userActions";
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
}) => {
  const selectedChat = useSelector((state) => state.user.selectedChat);
  const loggedinUser = useSelector((state) => state.user.userDetail);
  const chats = useSelector((state) => state.user.chats);
  const dispatch = useDispatch();

  const inputRef = useRef(null);

  const [typedMessages, setTypedMessages] = useState("");
  const [someoneTyping, setSomeoneTyping] = useState(null);
  const [showTapToInfoMessage, setShowTapToInfoMessage] = useState(false);

  const handleChange = (e) => {
    setTypedMessages(e.target.value);
    handleTypingMessageChange();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTypedMessages("");
    handleStopTyping();
    try {
      const res = await sendMessage(selectedChat._id, typedMessages);
      if (!res.data?.data) return;
      setMessages((pre) => [...pre, res.data.data]);
      const updatedChats = chats.map((el) =>
        el._id === selectedChat._id
          ? { ...el, latestMessage: res.data.data }
          : el
      );
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

  useEffect(() => {
    if (!selectedChat) return;
    setShowTapToInfoMessage(true);
    getMessages();
    inputRef.current.focus();
    const timerId = setTimeout(() => {
      setShowTapToInfoMessage(false);
    }, 1000);
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
              <span className="transition-opacity transition-transform duration-300 cursor-pointer">
                <h4>
                  {selectedChat?.isGroup
                    ? selectedChat.name
                    : getOppositeUserDetails(
                        loggedinUser,
                        selectedChat.participants
                      ).name}
                </h4>
                {someoneTyping ? (
                  <div className="text-[#00a261] text-[13px]">typing...</div>
                ) : (
                  showTapToInfoMessage && (
                    <div className=" text-[13px]">
                      Click here for{" "}
                      {selectedChat.isGroup ? "Group" : "Contact"} info
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
            <Messages messages={messages} isGroup={selectedChat?.isGroup} />
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
