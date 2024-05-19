import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Messages } from "@/components/chat/Messages";
import { useDispatch, useSelector } from "react-redux";
import { getSenderName } from "@/utils/functions";
import { getAllMessages, sendMessage } from "@/api";
import { updateChats, updateSelectedChat } from "@/redux/actions/userActions";

export const SelectedChat = ({ messages, setMessages }) => {
  const selectedChat = useSelector((state) => state.user.selectedChat);
  const loggedinUser = useSelector((state) => state.user.userDetail);
  const chats = useSelector((state) => state.user.chats);
  console.log("chats:", chats);
  const dispatch = useDispatch();

  const [typedMessages, setTypedMessages] = useState("");

  const handleChange = (e) => {
    setTypedMessages(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit...");
    setTypedMessages("");
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
  useEffect(() => {
    console.log("selectedChat:", selectedChat);
    if (!selectedChat) return;
    getMessages();
  }, [selectedChat]);

  return (
    <div className="bg-red-200 w-4/6">
      {selectedChat ? (
        <div>
          {/* Heading */}
          <div className="w-full h-16 bg-blue-500 flex justify-between items-center p-3">
            <div className="bg-green-300 flex gap-5 items-center">
              <div
                className="relative overflow-hidden bg-gray-200 rounded-full"
                style={{ height: "40px", width: "40px" }}
              >
                <img
                  className="w-full h-full object-cover absolute top-0 left-0"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX4bPpNmnBUF-JKHYe7g2joB4kJOwuKnp98A&usqp=CAU"
                  alt="Your Image"
                />
              </div>
              <h4 className="font-semibold">
                {selectedChat?.isGroup
                  ? selectedChat.name
                  : getSenderName(loggedinUser, selectedChat.participants)}
              </h4>
            </div>
            <div className=""></div>
          </div>
          {/* Chats */}
          <ScrollArea
            className="py-4 px-9 bg-purple-500 flex items-end"
            style={{ height: "calc(100vh - 128px)" }}
          >
            <Messages messages={messages} isGroup={selectedChat?.isGroup} />
          </ScrollArea>
          <div className="h-16 bg-orange-400 flex px-3 gap-3 items-center">
            <div>Emoji</div>
            <form onSubmit={handleSubmit} className="flex w-full gap-3">
              <input
                type="text"
                className="h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm outline-none"
                placeholder="Type a message"
                value={typedMessages}
                onChange={handleChange}
              />
              <button type="submit" className="bg-red-500">
                send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="border border-red-600 w-full h-screen flex items-center justify-center">
          Select Chat to Start Conversation
        </div>
      )}
    </div>
  );
};
