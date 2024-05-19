import { AllChats } from "@/components/chat/AllChats";
import { SelectedChat } from "@/components/chat/SelectedChat";
import { connectSocket } from "@/redux/actions/socketActions";
import {
  getChats,
  getNewFriends,
  getOrCreateChat,
  getSentRequests,
  getfriendRequests,
  getfriends,
  updateChats,
  updateFriendRequests,
  updateFriends,
  updateNewFriends,
  updateSentRequests,
} from "@/redux/actions/userActions";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const NEWFRIENDREQUEST = "new-friend-request";
const REQUESTSENT = "request-sent";
const REQUESTACCEPTED = "request-accepted";

export const ChatApp = () => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const newUsers = useSelector((state) => state.user.newUsers);
  const sentRequests = useSelector((state) => state.user.sentRequests);
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const friends = useSelector((state) => state.user.friends);
  const selectedChat = useSelector((state) => state.user.selectedChat);
  const chats = useSelector((state) => state.user.chats);

  const newUsersRef = useRef(null);
  newUsersRef.current = newUsers;
  const sentRequestsRef = useRef(null);
  sentRequestsRef.current = sentRequests;
  const friendRequestsRef = useRef(null);
  friendRequestsRef.current = friendRequests;
  const friendsRef = useRef(null);
  friendsRef.current = friends;
  const selectedChatRef = useRef(null);
  selectedChatRef.current = selectedChat;
  const chatsRef = useRef(null);
  chatsRef.current = chats;

  const [messages, setMessages] = useState([]);
  console.log("messages:", messages);

  const onRequestSent = (data) => {
    const updatedNewFriendsArray = [];
    const updatedSentRequests = sentRequestsRef.current || [];
    newUsersRef.current &&
      newUsersRef.current.forEach((el) =>
        el.userId !== data.sentTo
          ? updatedNewFriendsArray.push(el)
          : updatedSentRequests.push(el)
      );
    dispatch(updateNewFriends(updatedNewFriendsArray));
    dispatch(updateSentRequests(updatedSentRequests));
  };

  const onReceivedNewRequest = (data) => {
    const updatedNewFriendsArray = [];
    const updatedFriendRequests = friendRequestsRef.current || [];
    newUsersRef.current &&
      newUsersRef.current.forEach((el) =>
        el.userId !== data.sentBy
          ? updatedNewFriendsArray.push(el)
          : updatedFriendRequests.push({ ...el, requestId: data.requestId })
      );
    dispatch(updateNewFriends(updatedNewFriendsArray));
    dispatch(updateFriendRequests(updatedFriendRequests));
  };

  const onRequestAccepted = (data) => {
    if (data.receiverId) {
      // When Someone has accepted your request
      const updatedSentRequests = [];
      const updatedFriends = friendsRef.current || [];
      sentRequestsRef.current &&
        sentRequestsRef.current.forEach((el) =>
          el.userId !== data.receiverId
            ? updatedSentRequests.push(el)
            : updatedFriends.push(el)
        );
      dispatch(updateSentRequests(updatedSentRequests));
      dispatch(updateFriends(updatedFriends));
    } else if (data.senderId) {
      // When You accepted someone's request
      const updatedFriendRequests = [];
      const updatedFriends = friendsRef.current || [];
      friendRequestsRef.current &&
        friendRequestsRef.current.forEach((el) => {
          if (el.userId !== data.senderId) {
            delete el.requestId;
            updatedFriendRequests.push(el);
          } else {
            updatedFriends.push(el);
          }
        });
      dispatch(updateFriendRequests(updatedFriendRequests));
      dispatch(updateFriends(updatedFriends));
    }
  };

  const onMessageReceived = (message) => {
    const updatedChats = chatsRef.current?.map((el) =>
      el._id === message.chatId ? { ...el, latestMessage: message } : el
    );
    dispatch(updateChats(updatedChats));
    if (message.chatId === selectedChatRef.current?._id) {
      setMessages((pre) => [...pre, message]);
    } else {
      // TODO-> update the list of unread messages
    }
  };

  useEffect(() => {
    dispatch(connectSocket());
    dispatch(getNewFriends());
    dispatch(getSentRequests());
    dispatch(getfriendRequests());
    dispatch(getfriends());
    dispatch(getChats());
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("connected", (data) => {
      console.log("connected...", data);
    });
    socket.on(NEWFRIENDREQUEST, onReceivedNewRequest);
    socket.on(REQUESTSENT, onRequestSent);
    socket.on(REQUESTACCEPTED, onRequestAccepted);
    socket.on("messageReceived", onMessageReceived);

    return () => {
      socket.off("new-friend-request");
      socket.off("request-sent");
      socket.off("request-accepted");
    };
  }, [socket]);

  return (
    <div className="flex">
      <AllChats />
      <SelectedChat messages={messages} setMessages={setMessages} />
    </div>
  );
};
