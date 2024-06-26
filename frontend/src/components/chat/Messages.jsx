import React, { useEffect, useRef, useState } from "react";
import { MessageCard } from "../card/messageCard";
import { useSelector } from "react-redux";
import {
  dateConverter,
  generateColors,
  timeConverter,
} from "@/utils/functions";
export const Messages = ({
  messages,
  isGroup,
  noOfUnreadMessage,
  selectedChat,
}) => {
  const { userDetail } = useSelector((state) => state.user);

  const scrollToBottomRef = useRef(null);
  const scrollToUnreadMessageRef = useRef(null);
  const [colors, setColors] = useState([]);
  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    if (noOfUnreadMessage && firstTime) {
      scrollToUnreadMessageRef.current?.scrollIntoView();
    } else {
      scrollToBottomRef.current?.scrollIntoView();
    }
    messages?.length && setColors(generateColors(messages.length));
  }, [messages]);

  useEffect(() => {
    setFirstTime(true);
    const timerId = setTimeout(() => {
      setFirstTime(false);
    }, 500);
    return () => {
      timerId && clearTimeout(timerId);
    };
  }, [selectedChat]);

  return (
    <div className="flex flex-col gap-[5px] ">
      {messages.length > 0 &&
        messages.map((el, index) => (
          <MessageCard
            key={el._id}
            message={el.content}
            isOwnMessage={el.sender._id === userDetail?._id}
            isGroup={isGroup}
            sender={el.sender}
            isSenderSameAsLastSender={
              el.sender._id === messages[index - 1]?.sender?._id
            }
            time={timeConverter(el.updatedAt)}
            isMessageDateIsSameAsPreviousMessageDate={
              dateConverter(el.updatedAt) ===
              dateConverter(messages[index - 1]?.updatedAt)
            }
            day={dateConverter(el.updatedAt)}
            showUnreadMessageTag={
              noOfUnreadMessage && messages.length - noOfUnreadMessage === index
            }
            noOfUnreadMessage={noOfUnreadMessage}
            scrollToUnreadMessageRef={scrollToUnreadMessageRef}
          />
        ))}
      <div ref={scrollToBottomRef} />
    </div>
  );
};
