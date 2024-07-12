import React from "react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

export const ReceivingCall = ({
  onCallWithUser,
  setIsOnCall,
  setIsReceivingCall,
  setRemoteSocketId,
  handleEndVideoCall,
  setMyStream,
}) => {
  const socket = useSelector((state) => state.socket.socket);
  const loggedinUser = useSelector((state) => state.user.userDetail);

  const { toast } = useToast();

  const handleAcceptCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      socket.emit("accept-call", {
        sender: onCallWithUser,
        you: loggedinUser,
      });
      setRemoteSocketId(onCallWithUser._id);
      setIsOnCall(true);
      setIsReceivingCall(false);
    } catch (error) {
      console.log("error:", error);
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "You need to grant camera and microphone permissions",
      });
    }
  };
  const handleDeclineCall = () => {
    socket.emit("decline-call", {
      sender: onCallWithUser,
      you: loggedinUser,
    });
    handleEndVideoCall();
  };
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
