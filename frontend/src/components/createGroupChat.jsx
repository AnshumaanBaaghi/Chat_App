import { getFilteredArray } from "@/utils/functions";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FriendCard } from "./card/friendCard";
import { FaArrowLeft } from "react-icons/fa6";
import { createGroup } from "@/api";
import { getChats } from "@/redux/actions/userActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export const CreateGroupChat = ({ setShowCreateGroupModal }) => {
  const friends = useSelector((state) => state.user.friends);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showSecondStep, setShowSecondStep] = useState(false);

  const filteredOptions = getFilteredArray(query, friends).filter((friend) => {
    for (let i = 0; i < selectedParticipants.length; i++) {
      if (selectedParticipants[i].userId === friend.userId) return false;
    }
    return true;
  });

  const selectUser = (friend) => {
    setSelectedParticipants((prev) => [...prev, friend]);
  };
  const unselectUser = (friend) => {
    setSelectedParticipants((prev) =>
      prev.filter((el) => el.userId !== friend.userId)
    );
  };
  const handleSubmit = async () => {
    if (selectedParticipants.length < 2) return; // TODO: add toast here
    const participants = selectedParticipants.map((el) => el.userId);
    try {
      await createGroup(groupName, participants);
      setShowCreateGroupModal(false);
      dispatch(getChats());
    } catch (error) {
      console.log("error:", error);
    }
    console.log("working");
  };

  return (
    <div className="w-full overflow-hidden bg-gray-500 h-full">
      <div
        className={`grid grid-cols-2 border box-border border-green-600 transition-transform duration-500 ${
          showSecondStep && "-translate-x-1/2"
        }`}
        style={{ width: "200%" }}
      >
        <div className="w-[100%] bg-red-400 h-[50vh]">
          <div className="flex">
            <button onClick={() => setShowCreateGroupModal(false)}>
              <FaArrowLeft />
            </button>
            <h2>Add Participants</h2>
          </div>
          <div className="mt-2">
            {selectedParticipants.map((friend) => (
              <div
                key={friend.userId}
                className="inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-full bg-blue-100 text-blue-800"
              >
                <Avatar size="2rem" className="mr-2">
                  <AvatarImage src="https:encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4ZLEEDaC7_8qJqkthsik-Q0rr7TSzGfU6XA&usqp=CAU" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{friend.name}</span>
                <button
                  type="button"
                  className="ml-2 text-blue-600 hover:text-blue-900 focus:outline-none"
                  onClick={() => unselectUser(friend)}
                >
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              selectedParticipants.length > 0 ? "" : "Select Participants"
            }
            className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <div className="mt-1 w-full rounded-md bg-white shadow-lg z-10">
            {filteredOptions.length > 0 ? (
              <ul
                tabIndex="-1"
                role="listbox"
                className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
              >
                {filteredOptions.map((friend) => (
                  <li key={friend.userId} onClick={() => selectUser(friend)}>
                    <FriendCard user={friend} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 px-3 text-gray-500">No User found</p>
            )}
          </div>
          {selectedParticipants.length >= 2 && (
            <button onClick={() => setShowSecondStep(true)}>Next</button>
          )}
        </div>
        {showSecondStep && (
          <div className="w-[100%]">
            <button onClick={() => setShowSecondStep(false)}>
              <FaArrowLeft />
            </button>
            <motion.div
              className="w-[200px] h-[200px] bg-white"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "black",
              }}
              animate={{
                scale: [1, 2, 2, 1, 1],
                rotate: [0, 0, 180, 180, 0],
                borderRadius: ["0%", "0%", "50%", "50%", "50%"],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.8, 1],
              }}
            >
              user Image
            </motion.div>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group Name"
              className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button disabled={!groupName.trim()} onClick={handleSubmit}>
              create
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
