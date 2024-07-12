import React, { useCallback, useEffect, useState } from "react";
import { ReactIcon } from "../ReactIcon";
import { IoVideocam } from "react-icons/io5";
import { IoMdMic } from "react-icons/io";
import { Button } from "../ui/button";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";

export const OneOnOneVc = ({
  myStream,
  remoteStream,
  setRemoteStream,
  peer,
  remoteSocketId,
  callingStatus,
  handleEndVideoCall,
  onCallWithUser,
  loggedinUser,
}) => {
  const socket = useSelector((state) => state.socket.socket);
  const { toast } = useToast();
  const handleEndCall = () => {
    socket.emit("end-video-call", { you: loggedinUser });
    handleEndVideoCall();
  };

  const showToast = () => {
    toast({
      // variant: "destructive",
      title: "Coming Soon",
      description: "This feature will be coming soon!",
    });
  };

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.generateOffer();
    socket.emit("sending-negotiation-offer", {
      from: loggedinUser._id,
      to: remoteSocketId,
      offer,
    });
  }, [remoteSocketId]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (e) => {
      const stream = e.streams;
      setRemoteStream(stream[0]);
    });

    return () => {};
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);

  return (
    <div className="fixed w-full fullHeight bg-[#15171c]">
      <div className="w-full h-[5%] md:h-[10%] flex justify-center items-center text-white">
        {callingStatus}
      </div>
      <div className="h-[87%] md:h-[80%] flex flex-col gap-5 p-5 items-center justify-center md:flex-row">
        <div className="w-fit h-[80%] relative rounded-3xl overflow-hidden bg-[#0d0e12]">
          <ReactPlayer
            playing
            muted
            width="100%"
            height="100%"
            url={myStream}
            className="outline-none"
          />
          <span className="absolute bottom-3 left-3 text-white">You</span>
        </div>
        {remoteStream && (
          <div className="w-fit h-[80%] relative rounded-3xl overflow-hidden bg-[#0d0e12]">
            <ReactPlayer
              playing
              width="100%"
              height="100%"
              url={remoteStream}
            />
            <span className="absolute bottom-4 left-4 text-white">
              {onCallWithUser.name}
            </span>
          </div>
        )}
      </div>
      <div className="h-[8%] md:h-[10%] flex justify-center items-center gap-4">
        <ReactIcon size="30px" color="white">
          <IoMdMic onClick={showToast} />
        </ReactIcon>
        <ReactIcon size="30px" color="white">
          <IoVideocam onClick={showToast} />
        </ReactIcon>
        <Button variant="destructive" onClick={handleEndCall}>
          End Call
        </Button>
      </div>
    </div>
  );
};
