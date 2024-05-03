import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactIcon } from "../ReactIcon";
import { FaCircleUser } from "react-icons/fa6";

export const Chat = () => {
  return (
    <div className="px-3">
      <div className="flex gap-3 cursor-pointer border-b  border-b-blue-500 py-3">
        <Avatar>
          <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX4bPpNmnBUF-JKHYe7g2joB4kJOwuKnp98A&usqp=CAU" />
          <AvatarFallback>
            <ReactIcon color="grey" size="100%">
              <FaCircleUser />
            </ReactIcon>
          </AvatarFallback>
        </Avatar>
        <div
          className="box-border flex flex-col justify-between"
          style={{ width: "88%" }}
        >
          <div className="flex justify-between  items-center">
            <h4 className="font-semibold">Users Name</h4>
            <p className="text-xs">1:20 PM</p>
          </div>
          <div className="flex justify-between  items-center">
            <p className="text-sm">latsest message</p>
            <p className="w-6 h-6 rounded-full bg-green-700 text-xs flex items-center justify-center">
              1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
