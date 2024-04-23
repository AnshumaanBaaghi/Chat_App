import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Messages } from "@/components/chat/Messages";

export const SelectedChat = () => {
  return (
    <div className="bg-red-200 w-4/6">
      {/* Chats will be visible here */}
      <div>
        {/* Heading */}
        <div className="w-full h-16 bg-blue-500 flex justify-between items-center p-3">
          <div className="bg-green-300 flex gap-5 items-center">
            <div
              className="relative overflow-hidden bg-gray-200 rounded-full"
              style={{ height: "40px", width: "40px" }}
            >
              <img
                className="w-full h-full object-cover absolute top-0 left-0"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX4bPpNmnBUF-JKHYe7g2joB4kJOwuKnp98A&usqp=CAU"
                alt="Your Image"
              />
            </div>
            <h4 className="font-semibold">Users Name</h4>
          </div>
          <div className=""></div>
        </div>
        {/* Chats */}
        <ScrollArea
          className="py-4 px-9 bg-purple-500 flex items-end"
          style={{ height: "calc(100vh - 128px)" }}
        >
          <Messages />
        </ScrollArea>
        <div className="h-16 bg-orange-400 flex px-3 gap-3 items-center">
          <div>Emoji</div>
          <form
            //   onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full gap-3"
          >
            <input
              type="text"
              className="h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm outline-none"
              placeholder="Type a message"
            />
            <button type="submit" className="bg-red-500">
              send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
