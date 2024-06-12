import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FriendRequests } from "@/components/FriendRequests";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Explore } from "@/components/Explore";
import { Friends } from "@/components/Friends";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import {
  getFilteredUsersArray,
  getOppositeUserDetails,
} from "@/utils/functions";

export const Popup = ({
  closePopup,
  chats,
  loggedinUser,
  handleSelectChat,
}) => {
  const newUsers = useSelector((state) => state.user.newUsers);
  const sentRequests = useSelector((state) => state.user.sentRequests);
  const friends = useSelector((state) => state.user.friends);
  const friendRequests = useSelector((state) => state.user.friendRequests);

  const [selectedTab, setSelectedTab] = useState("Explore");
  const [query, setQuery] = useState("");
  const [newUsersArray, setNewUsersArray] = useState([]);
  const [sentRequestsArray, setSentRequestsArray] = useState([]);
  const [friendsArray, setFriendsArray] = useState([]);
  const [friendRequestsArray, setFriendRequestsArray] = useState([]);

  const onClickOnFriend = (friendId) => {
    for (let i = 0; i < chats.length; i++) {
      if (
        !chats[i].isGroup &&
        getOppositeUserDetails(loggedinUser, chats[i].participants)._id ===
          friendId
      ) {
        handleSelectChat(chats[i]);
        closePopup();
        return;
      }
    }
    closePopup();
  };

  useEffect(() => {
    setNewUsersArray(getFilteredUsersArray(query, newUsers));
    setSentRequestsArray(getFilteredUsersArray(query, sentRequests));
    setFriendsArray(getFilteredUsersArray(query, friends));
    setFriendRequestsArray(getFilteredUsersArray(query, friendRequests));
  }, [query, newUsers, sentRequests, friends, friendRequests]);

  return (
    <>
      <div className="h-[55vh] flex flex-col">
        <nav className="px-1 pt-1 pb-[2px] border-b border-b-[#eeeeee]">
          <ul className="list-none p-0 m-0  font-semibold text-base flex">
            <li
              className={`${
                "Explore" === selectedTab ? "bg-[#eee]" : ""
              } list-none font-sans text-[14px] rounded border-b-0 border-r-0 border-l-0 border-gray-300 w-full py-2 px-3 relative bg-white cursor-pointer flex justify-center items-center flex-1 min-w-0 user-select-none`}
              onClick={() => setSelectedTab("Explore")}
            >
              Explore
              {"Explore" === selectedTab ? (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-[#8855ff]"
                  layoutId="underline"
                />
              ) : null}
            </li>
            <li
              className={`${
                "Requests" === selectedTab ? "bg-[#eee]" : ""
              } list-none font-sans text-[14px] rounded border-b-0 border-r-0 border-l-0 border-gray-300 w-full py-2 px-3 relative bg-white cursor-pointer flex justify-center items-center flex-1 min-w-0 user-select-none`}
              onClick={() => setSelectedTab("Requests")}
            >
              Requests
              {"Requests" === selectedTab ? (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-[#8855ff]"
                  layoutId="underline"
                />
              ) : null}
            </li>
            <li
              className={`${
                "Friends" === selectedTab ? "bg-[#eee]" : ""
              } list-none font-sans text-[14px] rounded border-b-0 border-r-0 border-l-0 border-gray-300 w-full py-2 px-3 relative bg-white cursor-pointer flex justify-center items-center flex-1 min-w-0 user-select-none`}
              onClick={() => setSelectedTab("Friends")}
            >
              Friends
              {"Friends" === selectedTab ? (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-[#8855ff]"
                  layoutId="underline"
                />
              ) : null}
            </li>
          </ul>
        </nav>
        <div className="py-2 px-3">
          <Input
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>
        <ScrollArea className="flex flex-grow py-2 px-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab ? selectedTab.label : "empty"}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {selectedTab === "Explore" ? (
                <Explore
                  newUsers={newUsersArray}
                  friends={friendsArray}
                  sentRequests={sentRequestsArray}
                  friendRequests={friendRequestsArray}
                  onClickOnFriend={onClickOnFriend}
                />
              ) : selectedTab === "Requests" ? (
                <FriendRequests arr={friendRequestsArray} />
              ) : selectedTab === "Friends" ? (
                <Friends arr={friendsArray} onClickOnFriend={onClickOnFriend} />
              ) : (
                "😋"
              )}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </div>
    </>
  );
};
