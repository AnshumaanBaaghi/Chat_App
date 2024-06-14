import { getFilteredUsersArray } from "@/utils/functions";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FriendCard } from "./card/friendCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { addParticipantInGroup } from "@/api";
import { ScrollArea } from "./ui/scroll-area";

export const AddParticipantsToGroup = ({ selectedChat }) => {
  const friends = useSelector((state) => state.user.friends);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [nonparticipant, setNonparticipant] = useState([]);

  const filteredOptions = getFilteredUsersArray(query, nonparticipant).filter(
    (friend) => {
      for (let i = 0; i < selectedParticipants.length; i++) {
        if (selectedParticipants[i].userId === friend.userId) return false;
      }
      return true;
    }
  );

  const selectUser = (friend) => {
    setSelectedParticipants((prev) => [...prev, friend]);
  };

  const unselectUser = (friend) => {
    setSelectedParticipants((prev) =>
      prev.filter((el) => el.userId !== friend.userId)
    );
  };

  const addParticipant = async () => {
    try {
      for (let i of selectedParticipants) {
        await addParticipantInGroup(selectedChat._id, i.userId);
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      document.getElementById("addParticipantPopupCloseButton").click();
    }
  };

  useEffect(() => {
    const findNonparticipants = friends.filter((el) => {
      for (let i = 0; i < selectedChat.participants.length; i++) {
        if (selectedChat.participants[i]._id === el.userId) return false;
      }
      return true;
    });
    setNonparticipant(findNonparticipants);
  }, []);

  return (
    <div className="w-[100%] bg-[#15171c] h-[60vh] p-4">
      <p className="text-[#ffffffb6] text-lg text-center p-4">Add Members</p>
      <div className="mt-2">
        {selectedParticipants.map((friend) => (
          <div
            key={friend.userId}
            className="inline-flex items-center px-2 py-1 mr-2 mb-2 rounded-full bg-[#bcbbbb]"
          >
            <Avatar size="2.5rem" className="mr-2">
              <AvatarImage src={friend.avatar} />
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
        className="w-full px-3 py-2 bg-[#15171c] outline-none text-[#b8b3b3] border border-[#85818173] rounded-md shadow-sm  focus:border-[#dbd6d673]"
      />
      <div className="mt-1 w-full rounded-md shadow-lg z-10">
        {filteredOptions.length > 0 ? (
          <ScrollArea>
            <ul
              tabIndex="-1"
              role="listbox"
              className="max-h-[30vh] rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {filteredOptions.map((friend) => (
                <li
                  key={friend.userId}
                  onClick={() => selectUser(friend)}
                  className="bg-[#bcbbbb] rounded-sm m-1"
                >
                  <FriendCard user={friend} />
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <p className="py-2 px-3 text-[#ffffffe1]">No User found</p>
        )}
      </div>
      <Button
        onClick={addParticipant}
        disabled={!selectedParticipants.length}
        className="mt-3 bg-[#0a0a0ac9] border border-[#85818173] w-1/3 mx-auto text-[#ffffffd7] hover:bg-[#292928c9]"
      >
        Add
      </Button>
    </div>
  );
};
