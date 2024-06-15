import React, { useEffect, useState } from "react";
import { ImageUploadInputBox } from "./card/imageUploadInputBox";
import { FaArrowLeft } from "react-icons/fa6";
import { v4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "@/api";
import { logout, updateUserDetail } from "@/redux/actions/userActions";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export const UserProfileSidebar = ({ setShowUserProfileSidebar }) => {
  const { userId, avatar, name, username, email } = useSelector(
    (state) => state.user.userDetail
  );
  const dispatch = useDispatch();

  const [imageUrl, setImageUrl] = useState(null);

  const handleRemoveImage = async () => {
    setImageUrl(null);
    try {
      await updateUserDetails({ avatar: null });
      dispatch(updateUserDetail({ avatar: null }));
    } catch (error) {
      console.log("error:", error);
    }
  };

  const onChangeImage = async (url) => {
    await updateUserDetails({ avatar: url });
    dispatch(updateUserDetail({ avatar: url }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    setTimeout(() => {
      setImageUrl(avatar);
    }, 250);
  }, []);
  return (
    <div className="bg-[#0d0e12]">
      <ScrollArea className="h-screen">
        <div className="w-full flex flex-col p-2 justify-between h-screen gap-4">
          <div className="w-[100%] flex flex-col relative">
            <button
              onClick={() => setShowUserProfileSidebar(false)}
              className="text-[#ffffffa2] absolute left-3 top-3 text-2xl"
            >
              <FaArrowLeft />
            </button>
            <p className="text-[#ffffffb6] bg-[#15171c] text-xl text-center p-4 capitalize">
              Profile
            </p>
            <div className="flex justify-center pt-5 bg-[#15171c]">
              <ImageUploadInputBox
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
                firebasePath={`profileImages/${userId || v4()}`}
                onRemoveImage={handleRemoveImage}
                onChangeImage={onChangeImage}
                placeholder="Add Group Picture"
                size="12rem"
              />
            </div>
            <div className="bg-[#15171c] mt-2 p-3">
              <div className="text-[#e0dbdbd6] text-sm">Your Name</div>
              <p className="text-[#fff] mt-2">{name}</p>
              <div className="text-[#e0dbdbd6] text-sm mt-7">Your Username</div>
              <p className="text-[#fff] mt-2">{username}</p>
              <div className="text-[#e0dbdbd6] text-sm mt-7">Your Email</div>
              <p className="text-[#fff] mt-2">{email}</p>
            </div>
          </div>
          <Button
            className="w-[100%]"
            variant="destructive"
            onClick={handleLogout}
          >
            LOGOUT
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
