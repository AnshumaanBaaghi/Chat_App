import { getFilteredUsersArray } from "@/utils/functions";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FriendCard } from "./card/friendCard";
import { FaArrowLeft } from "react-icons/fa6";
import { createGroup } from "@/api";
import { getChats, updateChats } from "@/redux/actions/userActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUploadInputBox } from "./card/imageUploadInputBox";
import { v4 } from "uuid";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export const CreateGroupChat = ({ setShowCreateGroupModal, chats }) => {
  const friends = useSelector((state) => state.user.friends);
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [showSecondStep, setShowSecondStep] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const filteredOptions = getFilteredUsersArray(query, friends).filter(
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

  const handleSubmit = async () => {
    if (selectedParticipants.length < 2) return; // TODO: add toast here
    const participants = selectedParticipants.map((el) => el.userId);
    try {
      const res = await createGroup(groupName, participants, imageUrl);
      console.log("res group created:", res);
      setShowCreateGroupModal(false);
      const updatedChat = [res.data.data, ...chats];
      dispatch(updateChats(updatedChat));
    } catch (error) {
      console.log("error:", error);
    }
  };

  const onRemoveImage = () => {
    setImageUrl(null);
  };

  return (
    <div className="w-full  bg-[#0d0e12] h-screen">
      <div
        className={`grid grid-cols-2 box-border  transition-transform duration-500 ${
          showSecondStep && "-translate-x-1/2"
        }`}
        style={{ width: "200%" }}
      >
        <div className="w-[100%] flex flex-col justify-between ">
          <div className="w-[100%] flex flex-col relative">
            <button
              onClick={() => setShowCreateGroupModal(false)}
              className="text-[#ffffffa2] absolute left-5 top-5 text-2xl"
            >
              <FaArrowLeft />
            </button>
            <p className="text-[#ffffffb6] bg-[#15171c] text-xl text-center p-5 capitalize">
              Add Participants
            </p>
          </div>

          <ScrollArea>
            <div className="max-h-[75vh]">
              <div className=" mt-2 bg-[#15171c] px-2 py-5">
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
              <div className="p-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    selectedParticipants.length > 0 ? "" : "Select Participants"
                  }
                  className="w-full px-3 py-2 bg-[#15171c] outline-none text-[#b8b3b3] border border-[#85818173] rounded-md shadow-sm  focus:border-[#dbd6d673]"
                />
              </div>

              <div className="mt-3 w-full rounded-md shadow-lg z-10 p-2 bg-[#15171c]">
                {filteredOptions.length > 0 ? (
                  <ul
                    tabIndex="-1"
                    role="listbox"
                    className=" rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
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
                ) : (
                  <p className="py-2 text-center text-[#ffffffe1]">
                    No User found
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
          <Button
            disabled={selectedParticipants.length < 2}
            onClick={() => setShowSecondStep(true)}
            className="mt-3 bg-[#0a0a0ac9] border border-[#85818173] w-1/3 mx-auto text-[#ffffffd7] hover:bg-[#292928c9]"
          >
            Next
          </Button>
        </div>
        {showSecondStep && (
          <div className="w-[100%] flex flex-col relative">
            <button
              onClick={() => setShowSecondStep(false)}
              className="text-[#ffffffa2] absolute left-3 top-3 text-2xl"
            >
              <FaArrowLeft />
            </button>
            <p className="text-[#ffffffb6] bg-[#15171c] text-xl text-center p-4 capitalize">
              Add Group Icon
            </p>
            <div className="flex justify-center pt-5 bg-[#15171c]">
              <ImageUploadInputBox
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                firebasePath={`groupImages/${v4()}`}
                onRemoveImage={onRemoveImage}
                placeholder="Add Group Picture"
                size="12rem"
              />
            </div>
            <div className="bg-[#15171c] mt-2 p-3">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
                className="w-full px-3 py-2 bg-[#15171c] outline-none text-[#b8b3b3] border border-[#85818173] rounded-md shadow-sm  focus:border-[#dbd6d673]"
              />
              <Button
                disabled={!groupName.trim()}
                onClick={handleSubmit}
                className="mt-3 bg-[#0a0a0ac9] border border-[#85818173] w-1/3 mx-auto text-[#ffffffd7] hover:bg-[#292928c9]"
              >
                create
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
