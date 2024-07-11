import React from "react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";

export const ReceivingCall = ({
  details,
  setIsOnCall,
  setReceivingCallDetails,
  setRemoteSocketId,
}) => {
  console.log("sender receving call:", details.sender.name);
  const socket = useSelector((state) => state.socket.socket);
  const loggedinUser = useSelector((state) => state.user.userDetail);

  const handleAcceptCall = () => {
    socket.emit("accept-call", {
      sender: details.sender,
      chatId: details.chatId,
      you: loggedinUser,
    });
    setRemoteSocketId(details.sender._id);
    setIsOnCall(true);
    setReceivingCallDetails(null);
  };
  const handleDeclineCall = () => {};
  if (!details.sender || !details.chatId) return;
  return (
    <div className="fixed w-full fullHeight bg-red-300 flex flex-col justify-center items-center">
      <div>{`Getting call from ${details.sender?.name}`}</div>
      <div>
        <Button onClick={handleAcceptCall}>Accept</Button>
        <Button onClick={handleDeclineCall}>Decline</Button>
      </div>
    </div>
  );
};
