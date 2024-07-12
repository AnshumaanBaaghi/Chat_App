import React from "react";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <div className="fixed w-full fullHeight bg-[#15171c] flex flex-col gap-5  justify-center items-center">
      <div className="text-white">{`Getting call from ${onCallWithUser.name}`}</div>
      <Avatar size="17rem">
        <AvatarImage src={onCallWithUser.avatar} />
        <AvatarFallback>No Profile</AvatarFallback>
      </Avatar>
      <div className="flex gap-3">
        <Button onClick={handleAcceptCall} className="bg-green-400">
          Accept
        </Button>
        <Button onClick={handleDeclineCall} className="bg-red-500">
          Decline
        </Button>
      </div>
    </div>
  );
};
