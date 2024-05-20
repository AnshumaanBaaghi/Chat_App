import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const uploadImage = async (localImagePath, firebasePath) => {
  const imageRef = ref(storage, firebasePath || "");
  try {
    const res = await uploadBytes(imageRef, localImagePath);
    const url = await getDownloadURL(res.ref);
    return url;
  } catch (error) {
    console.log("error:", error);
    return error;
  }
};
