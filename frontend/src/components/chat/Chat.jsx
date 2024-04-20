import React from "react";

export const Chat = () => {
  return (
    <div className="px-3">
      <div className="flex gap-3 cursor-pointer border-b  border-b-blue-500 py-3">
        <div
          className="relative overflow-hidden bg-gray-200 rounded-full"
          style={{ paddingTop: "12%", width: "12%" }}
        >
          <img
            className="w-full h-full object-cover absolute top-0 left-0"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX4bPpNmnBUF-JKHYe7g2joB4kJOwuKnp98A&usqp=CAU"
            alt="Your Image"
          />
        </div>
        <div
          className="  box-border flex flex-col justify-between"
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
