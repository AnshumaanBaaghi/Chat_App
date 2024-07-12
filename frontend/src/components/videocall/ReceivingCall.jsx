import React from "react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";

export const ReceivingCall = ({
  onCallWithUser,
  setIsOnCall,
  setIsReceivingCall,
  setRemoteSocketId,
}) => {
  const socket = useSelector((state) => state.socket.socket);
  const loggedinUser = useSelector((state) => state.user.userDetail);

  const handleAcceptCall = () => {
    socket.emit("accept-call", {
      sender: onCallWithUser,
      you: loggedinUser,
    });
    setRemoteSocketId(onCallWithUser._id);
    setIsOnCall(true);
    setIsReceivingCall(false);
  };
  const handleDeclineCall = () => {};
  if (!onCallWithUser) return;
  return (
    <div className="fixed w-full fullHeight bg-red-300 flex flex-col justify-center items-center">
      <div>{`Getting call from ${onCallWithUser?.name}`}</div>
      <div>
        <Button onClick={handleAcceptCall}>Accept</Button>
        <Button onClick={handleDeclineCall}>Decline</Button>
      </div>
    </div>
  );
};
