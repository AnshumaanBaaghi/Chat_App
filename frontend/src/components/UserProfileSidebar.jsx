import React, { useEffect, useState } from "react";
import { ImageUploadInputBox } from "./card/imageUploadInputBox";
import { FaArrowLeft } from "react-icons/fa6";
import { v4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "@/api";
import { logout, updateUserDetail } from "@/redux/actions/userActions";
import { Button } from "./ui/button";

export const UserProfileSidebar = ({ setShowUserProfileSidebar }) => {
  const { userId, avatar, name, username } = useSelector(
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
    <div className="w-full overflow-hidden bg-gray-500 h-full flex flex-col p-2 justify-between">
      <div className="w-[100%] bg-[#00a261] flex flex-col">
        <div className="flex">
          <button onClick={() => setShowUserProfileSidebar(false)}>
            <FaArrowLeft />
          </button>
          <h2>Profile</h2>
        </div>
        <div className="flex justify-center">
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
        <div>Name: {name}</div>
        <div>Username: {username}</div>
      </div>
      <Button className="w-[50%]" variant="destructive" onClick={handleLogout}>
        LOGOUT
      </Button>
    </div>
  );
};
