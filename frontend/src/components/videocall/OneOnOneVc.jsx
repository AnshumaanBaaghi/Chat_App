import React, { useCallback, useEffect, useState } from "react";
import { ReactIcon } from "../ReactIcon";
import { IoVideocam } from "react-icons/io5";
import { IoMdMic } from "react-icons/io";
import { Button } from "../ui/button";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { initialiseVc_api } from "@/api";

export const OneOnOneVc = ({ setIsOnCall, selectedChat }) => {
  const socket = useSelector((state) => state.socket.socket);
  const loggedinUser = useSelector((state) => state.user.userDetail);

  const [myStream, setMyStream] = useState(null);

  const handleEndCall = () => {
    myStream.getTracks().forEach((track) => track.stop());
    setMyStream(null);
    setIsOnCall(false);
  };

  const initialiseStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    initialiseStream();
  }, []);

  return (
    <div className="fixed w-full fullHeight bg-red-300">
      <div className="h-[90%] bg-blue-500 flex gap-5 p-5 items-center">
        <div className="w-full h-full relative rounded-3xl overflow-hidden">
          <ReactPlayer
            playing
            muted
            width="100%"
            height="100%"
            url={myStream}
            className="outline-none"
          />
          <span className="absolute bottom-3 left-3 text-white ">You</span>
        </div>
        {/* <ReactPlayer playing muted width="100%" height="100%" url={myStream} /> */}
      </div>
      <div className="h-[10%] bg-green-500 flex justify-center items-center gap-2">
        <ReactIcon size="30px">
          <IoMdMic />
        </ReactIcon>
        <ReactIcon size="30px">
          <IoVideocam />
        </ReactIcon>
        <Button variant="destructive" onClick={handleEndCall}>
          End Call
        </Button>
      </div>
    </div>
  );
};
