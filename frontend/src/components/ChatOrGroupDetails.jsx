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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCircleUser } from "react-icons/fa6";
import { ReactIcon } from "./ReactIcon";
import {
  getOppositeUserDetails,
  rearangeParticipants,
} from "@/utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { ImageUploadInputBox } from "./card/imageUploadInputBox";
import { updateGroup } from "@/api";
import { updateChats, updateSelectedChat } from "@/redux/actions/userActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const ChatOrGroupDetails = ({ selectedChat }) => {
  const loggedinUser = useSelector((state) => state.user.userDetail);
  const chats = useSelector((state) => state.user.chats);
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState(null);
  console.log("imageUrl:", imageUrl);

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

  useEffect(() => {
    selectedChat &&
      selectedChat.isGroup &&
      setTimeout(() => {
        setImageUrl(selectedChat.avatar);
      }, 250);
  }, [selectedChat]);

  if (!selectedChat) return <></>;
  console.log("selectedChat:", selectedChat);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button id="openChatDetailSheet" className="hidden"></Button>
      </SheetTrigger>
      <SheetContent className="overflow-x-scroll">
        <ScrollArea>
          <SheetHeader>
            <SheetTitle className="text-center">
              {selectedChat.isGroup ? "Group info" : "User Info"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-4 flex justify-center">
            {selectedChat.isGroup ? (
              loggedinUser.userId === selectedChat.admin ? (
                <ImageUploadInputBox
                  imageUrl={imageUrl}
                  setImageUrl={setImageUrl}
                  firebasePath={`groupImages/${selectedChat._id || v4()}`}
                  onRemoveImage={handleRemoveImage}
                  onChangeImage={onChangeImage}
                  placeholder="Add Group Picture"
                  size="17rem"
                />
              ) : (
                <Avatar size="17rem">
                  <AvatarImage
                    src={selectedChat.avatar}
                    className="cursor-pointer"
                    onClick={() => console.log("workig...")}
                  />
                  <AvatarFallback>No Profile</AvatarFallback>
                </Avatar>
              )
            ) : (
              <Avatar size="17rem">
                <Dialog>
                  <DialogTrigger>
                    <AvatarImage
                      src={
                        getOppositeUserDetails(
                          loggedinUser,
                          selectedChat.participants
                        ).avatar
                      }
                      className="cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-[50vw] max-h-[100vh] h-fit flex justify-center bg-transparent border-none">
                    <ScrollArea>
                      <Avatar size="40rem">
                        <AvatarImage
                          src={
                            getOppositeUserDetails(
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

                <AvatarFallback>No Profile</AvatarFallback>
              </Avatar>
            )}
          </div>
          <p>
            {selectedChat.isGroup
              ? selectedChat.name
              : getOppositeUserDetails(loggedinUser, selectedChat.participants)
                  .name}
          </p>
          <p>
            {selectedChat.isGroup
              ? `Group: ${selectedChat.participants.length} Members`
              : getOppositeUserDetails(loggedinUser, selectedChat.participants)
                  .username}
          </p>
          {selectedChat.isGroup && (
            <div className="w-full bg-blue-100">
              <p>{selectedChat.participants.length} Members</p>
              {rearangeParticipants(
                loggedinUser,
                selectedChat.admin,
                selectedChat.participants
              ).map((el) => (
                <div>
                  <Avatar size="3.5rem">
                    <AvatarImage src={el.avatar} />
                    <AvatarFallback>
                      <ReactIcon color="gray" size="100%">
                        <FaCircleUser />
                      </ReactIcon>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p> {el._id === loggedinUser.userId ? "You" : el.name}</p>
                    <p> {el._id === loggedinUser.userId ? "" : el.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {selectedChat.isGroup && (
            <div className="w-full bg-blue-100">
              <p>{selectedChat.participants.length} Members</p>
              {rearangeParticipants(
                loggedinUser,
                selectedChat.admin,
                selectedChat.participants
              ).map((el) => (
                <div>
                  <Avatar size="3.5rem">
                    <AvatarImage src={el.avatar} />
                    <AvatarFallback>
                      <ReactIcon color="gray" size="100%">
                        <FaCircleUser />
                      </ReactIcon>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p> {el._id === loggedinUser.userId ? "You" : el.name}</p>
                    <p> {el._id === loggedinUser.userId ? "" : el.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
