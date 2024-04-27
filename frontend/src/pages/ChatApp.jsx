import { AllChats } from "@/components/chat/AllChats";
import { SelectedChat } from "@/components/chat/SelectedChat";
import { connectSocket } from "@/redux/actions/socketActions";
import {
  getNewFriends,
  getSentRequests,
  getfriendRequests,
} from "@/redux/actions/userActions";
import { useSocket } from "@/socket/useSocket";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const NEWFRIENDREQUEST = "new-friend-request";
const REQUESTSENT = "request-sent";
const REQUESTACCEPTED = "request-accepted";

export const ChatApp = () => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);

  useEffect(() => {
    dispatch(connectSocket());
    dispatch(getNewFriends());
    dispatch(getSentRequests());
  }, []);

  useEffect(() => {
    console.log("chatapp socket:", socket);
    if (!socket) {
      return;
    }
    socket.on("connected", (data) => {
      console.log("connected...", data);
    });
    socket.on(NEWFRIENDREQUEST, (data) => {
      console.log("new-friend-request:", data);
    });
    socket.on(REQUESTSENT, (data) => {
      console.log("request-sent:", data);
    });
    socket.on(REQUESTACCEPTED, (data) => {
      console.log("request-accepted:", data);
    });

    return () => {
      socket.off("new-friend-request");
      socket.off("request-sent");
      socket.off("request-accepted");
    };
  }, [socket]);

  return (
    <div className="flex">
      <AllChats />
      <SelectedChat />
    </div>
  );
};
