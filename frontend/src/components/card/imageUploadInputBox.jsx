import { uploadImage } from "@/firebase/uploadImage";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loading } from "../loading";

export const ImageUploadInputBox = ({
  imageUrl,
  setImageUrl,
  firebasePath,
  onRemoveImage,
  onChangeImage,
  placeholder = "Upload Image",
  size,
  options = [],
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const localImagePath = e.target.files[0];
    if (!localImagePath) return;
    setIsLoading(true);
    setImageUrl(null);
    try {
      const url = await uploadImage(localImagePath, firebasePath);
      await setImageUrl(url);
      {
        onChangeImage && onChangeImage(url);
      }
    } catch (error) {
      console.log("error:", error);
    }
    setIsLoading(false);
  };

  const handleClick = () => {
    if (imageUrl) return;
    triggerFileInput();
  };

  const triggerFileInput = () => {
    document.getElementById("profileImageInput").click();
  };

  return (
    <DropdownMenu>
      <div
        className={`profile-picture-uploader size-fit group relative ${className}`}
      >
        <input
          type="file"
          id="profileImageInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageUpload}
        />
        <motion.div
          onClick={handleClick}
          className="box cursor-pointer"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <Avatar size={size}>
            <AvatarImage src={imageUrl} />
            <AvatarFallback>
              {isLoading ? <Loading /> : placeholder}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <DropdownMenuTrigger className="bg-red-500">
          {imageUrl && (
            <span
              className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 rounded-full"
              style={{ width: size, height: size }}
            >
              Update Image
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={triggerFileInput}>
            Change Image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRemoveImage}>
            Remove Image
          </DropdownMenuItem>
          {options.length > 0 &&
            options.map((el) => (
              <DropdownMenuItem onClick={el.callback || null}>
                {el.option}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
};
