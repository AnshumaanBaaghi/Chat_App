import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCircleUser } from "react-icons/fa6";
import { ReactIcon } from "./ReactIcon";
import {
  getOppositeUserDetails,
  rearangeParticipants,
} from "@/utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { ImageUploadInputBox } from "./card/imageUploadInputBox";
import {
  deleteGroup_api,
  removeParticipantFromGroup,
  updateGroup,
} from "@/api";
import { updateChats, updateSelectedChat } from "@/redux/actions/userActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { AddParticipantsToGroup } from "./AddParticipantsToGroup";

export const ChatOrGroupDetails = ({ selectedChat }) => {
  const loggedinUser = useSelector((state) => state.user.userDetail);
  const chats = useSelector((state) => state.user.chats);
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState(null);

  const handleRemoveImage = async () => {
    setImageUrl(null);
    try {
      await updateGroup({ avatar: null }, selectedChat._id);
      const updatedChats = chats.map((el) =>
        el._id === selectedChat._id ? { ...el, avatar: null } : el
      );
      dispatch(updateChats(updatedChats));
      dispatch(updateSelectedChat({ ...selectedChat, avatar: null }));
    } catch (error) {
      console.log("error:", error);
    }
  };

  const onChangeImage = async (url) => {
    await updateGroup({ avatar: url }, selectedChat._id);
    const updatedChats = chats.map((el) =>
      el._id === selectedChat._id ? { ...el, avatar: url } : el
    );
    dispatch(updateChats(updatedChats));
    dispatch(updateSelectedChat({ ...selectedChat, avatar: url }));
  };

  const removeParticipant = async (participant) => {
    try {
      const res = await removeParticipantFromGroup(
        selectedChat._id,
        participant._id
      );
      console.log("res:", res);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      await deleteGroup_api(groupId);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const viewProfileOrGroupImage = () => {
    document.getElementById("openProfileOrGroupImage")?.click();
  };

  useEffect(() => {
    selectedChat &&
      selectedChat.isGroup &&
      setTimeout(() => {
        setImageUrl(selectedChat.avatar);
      }, 250);
  }, [selectedChat]);

  if (!selectedChat) return <></>;
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button id="openChatDetailSheet" className="hidden"></Button>
        </SheetTrigger>
        <SheetContent className="bg-[#15171c] p-0">
          <ScrollArea className="fullHeight">
            <p className="text-center text-[#ffffffb6] text-lg mt-6">
              {selectedChat.isGroup ? "Group info" : "User Info"}
            </p>
            <div className="py-4 flex justify-center">
              {selectedChat.isGroup ? (
                loggedinUser._id === selectedChat.admin ? (
                  <ImageUploadInputBox
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    firebasePath={`groupImages/${selectedChat._id || v4()}`}
                    onRemoveImage={handleRemoveImage}
                    onChangeImage={onChangeImage}
                    placeholder="Add Group Picture"
                    size="17rem"
                    options={[
                      {
                        option: "View Image",
                        callback: viewProfileOrGroupImage,
                      },
                    ]}
                  />
                ) : (
                  <Avatar size="17rem">
                    <AvatarImage
                      onClick={viewProfileOrGroupImage}
                      src={selectedChat.avatar}
                      className="cursor-pointer"
                    />
                    <AvatarFallback>No Profile</AvatarFallback>
                  </Avatar>
                )
              ) : (
                <Avatar size="17rem">
                  <AvatarImage
                    onClick={viewProfileOrGroupImage}
                    src={
                      getOppositeUserDetails(
                        loggedinUser,
                        selectedChat.participants
                      ).avatar
                    }
                    className="cursor-pointer"
                  />

                  <AvatarFallback>No Profile</AvatarFallback>
                </Avatar>
              )}
            </div>
            <p className="text-center text-2xl text-[#fff]">
              {selectedChat.isGroup
                ? selectedChat.name
                : getOppositeUserDetails(
                    loggedinUser,
                    selectedChat.participants
                  ).name}
            </p>
            <p className="text-[#ffffffe1] text-lg text-center">
              {selectedChat.isGroup
                ? `Group: ${selectedChat.participants.length} Members`
                : getOppositeUserDetails(
                    loggedinUser,
                    selectedChat.participants
                  ).username}
            </p>
            {selectedChat.isGroup && (
              <div className="w-full mt-6 bg-[#0d0e12] border-t border-t-[#5c5d61] py-3">
                {selectedChat.admin === loggedinUser._id && (
                  <Dialog>
                    <DialogTrigger className="w-full">
                      <div className="w-full p-3 text-[#ffffffed] hover:bg-[#1b1b1b] bg-[#131212] mb-1 capitalize">
                        Add Members
                      </div>
                    </DialogTrigger>
                    <DialogContent className="border border-[#474748]">
                      <AddParticipantsToGroup selectedChat={selectedChat} />
                      <DialogClose asChild>
                        <span
                          className="hidden"
                          id="addParticipantPopupCloseButton"
                        >
                          close
                        </span>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                )}
                {rearangeParticipants(
                  loggedinUser,
                  selectedChat.admin,
                  selectedChat.participants
                ).map((el) => (
                  <div
                    key={el._id}
                    className="flex text-[#ffffffed] hover:bg-[#1b1b1b] gap-3 relative p-2 "
                  >
                    <Avatar size="3.5rem">
                      <AvatarImage src={el.avatar} />
                      <AvatarFallback>
                        <ReactIcon color="gray" size="100%">
                          <FaCircleUser />
                        </ReactIcon>
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p> {el._id === loggedinUser._id ? "You" : el.name}</p>
                      <p>{el._id === loggedinUser._id ? "" : el.username}</p>
                    </div>
                    {selectedChat.admin === el._id && (
                      <div className="absolute right-3 top-2 text-xs bg-[#6260604f] rounded-lg px-2 py-1">
                        Admin
                      </div>
                    )}
                    {selectedChat.admin === loggedinUser._id &&
                      loggedinUser._id !== el._id && (
                        <Button
                          onClick={() => removeParticipant(el)}
                          className="absolute right-1 bottom-1 text-red-500"
                          variant="link"
                        >
                          remove
                        </Button>
                      )}
                  </div>
                ))}
                <Button
                  onClick={() =>
                    removeParticipant({
                      _id: loggedinUser._id,
                      ...loggedinUser,
                    })
                  }
                  className="w-full mt-2 py-6 hover:bg-[#1b1b1b] bg-[#131212] text-red-500 capitalize"
                >
                  Leave Group
                </Button>
                {selectedChat.admin === loggedinUser._id && (
                  <Button
                    onClick={() => deleteGroup(selectedChat._id)}
                    className="w-full mt-1 py-6 hover:bg-[#1b1b1b] bg-[#131212] text-red-500 capitalize"
                  >
                    Delete Group
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <Dialog>
        <DialogTrigger>
          <button id="openProfileOrGroupImage" className="hidden"></button>
        </DialogTrigger>
        <DialogContent className="max-w-[100vw] md:max-w-[50vw] max-h-[100vh] max-h-[100svh] flex justify-center  border-none bg-[#ffffff1c]">
          <ScrollArea>
            <Avatar
              size={window.innerWidth > 720 ? "40vw" : "90vw"}
              className="rounded-none"
            >
              <AvatarImage
                src={
                  selectedChat.isGroup
                    ? selectedChat.avatar
                    : getOppositeUserDetails(
                        loggedinUser,
                        selectedChat.participants
                      ).avatar
                }
              />
              <AvatarFallback>No Profile</AvatarFallback>
            </Avatar>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
