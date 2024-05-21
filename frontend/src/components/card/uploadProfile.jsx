import { uploadImage } from "@/firebase/uploadImage";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 } from "uuid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loading } from "../loading";
import { updateUserDetails } from "@/api";
import { updateUserDetail } from "@/redux/actions/userActions";

export const UploadProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const { userId } = useSelector((state) => state.user.userDetail);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  console.log("userId:", userId);

  const handleImageUpload = async (e) => {
    const localImagePath = e.target.files[0];
    if (!localImagePath) return;
    setIsLoading(true);
    setProfileImage(null);
    try {
      const firebasePath = `profileImages/${userId || v4()}`;
      const url = await uploadImage(localImagePath, firebasePath);
      console.log("url:", url);

      await updateUserDetails({ avatar: url });
      setProfileImage(url);
      dispatch(updateUserDetail({ avatar: url }));
    } catch (error) {
      console.log("error:", error);
    }
    setIsLoading(false);
  };
  const handleClick = () => {
    if (profileImage) return;
    triggerFileInput();
  };

  const triggerFileInput = () => {
    document.getElementById("profileImageInput").click();
  };

  return (
    <DropdownMenu>
      <div className="profile-picture-uploader border border-red-400 size-fit group relative">
        <input
          type="file"
          id="profileImageInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageUpload}
        />
        <div onClick={handleClick} className=" cursor-pointer">
          <Avatar size="10rem">
            <AvatarImage src={profileImage} />
            <AvatarFallback>
              {isLoading ? <Loading /> : "Add Profile Image"}
            </AvatarFallback>
          </Avatar>
        </div>
        <DropdownMenuTrigger className="bg-red-500">
          {profileImage && (
            <span
              className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 rounded-full"
              style={{ width: "10rem", height: "10rem" }}
            >
              Update Image
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={triggerFileInput}>
            Change Image
          </DropdownMenuItem>
          <DropdownMenuItem>Remove Image</DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};
