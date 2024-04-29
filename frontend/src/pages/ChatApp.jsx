import { AllChats } from "@/components/chat/AllChats";
import { SelectedChat } from "@/components/chat/SelectedChat";
import { connectSocket } from "@/redux/actions/socketActions";
import {
  getNewFriends,
  getSentRequests,
  getfriendRequests,
  updateNewFriends,
  updateSentRequests,
} from "@/redux/actions/userActions";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const NEWFRIENDREQUEST = "new-friend-request";
const REQUESTSENT = "request-sent";
const REQUESTACCEPTED = "request-accepted";

export const ChatApp = () => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const newUsers = useSelector((state) => state.user.newUsers);
  const sentRequests = useSelector((state) => state.user.sentRequests);

  const newUsersRef = useRef(null);
  newUsersRef.current = newUsers;
  const sentRequestsRef = useRef(null);
  sentRequestsRef.current = sentRequests;

  const onRequestSent = (data) => {
    const updatedNewFriendsArray = [];
    const updatedSentRequests = sentRequestsRef.current || [];
    newUsersRef.current &&
      newUsersRef.current.forEach((el) =>
        el._id !== data.sentTo
          ? updatedNewFriendsArray.push(el)
          : updatedSentRequests.push(el)
      );
    dispatch(updateNewFriends(updatedNewFriendsArray));
    dispatch(updateSentRequests(updatedSentRequests));
  };

  useEffect(() => {
    dispatch(connectSocket());
    dispatch(getNewFriends());
    dispatch(getSentRequests());
    dispatch(getfriendRequests());
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on("connected", (data) => {
      console.log("connected...", data);
    });
    socket.on(NEWFRIENDREQUEST, (data) => {
      console.log("new-friend-request:", data);
    });
    socket.on(REQUESTSENT, onRequestSent);
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
