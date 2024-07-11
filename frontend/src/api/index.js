import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//<--------------------------------Users----------------------------------------------->
export const registerUser = (data) => {
  return api.post("/user/register", data);
};

export const loginUser = (data) => {
  return api.post("/user/login", data);
};

export const logout_api = () => {
  return api.post("/user/logout");
};

export const sendOtp = (email) => {
  return api.post("/user/send-otp", { email });
};

export const verifyOtp = (otp, email) => {
  return api.post("/user/verify-otp", { email, otp });
};

export const userDetails = () => {
  return api.get("/user/me");
};

export const updateUserDetails = (data) => {
  return api.post("/user/me", data);
};

export const newFriends = () => {
  return api.get("/user/search-new-friends");
};

export const friends = () => {
  return api.get("/user/get-friends");
};

export const friendRequests = () => {
  return api.get("/user/get-friend-requests");
};

export const sentRequests = () => {
  return api.get("/user/get-sent-requests");
};

export const removeUnreadMessage_api = (chatId) => {
  return api.delete(`/user/unreadMessages/${chatId}`);
};

//<-------------------------------------------------Chats------------------------------------------------->
export const getOrCreateChat_api = (receiverId) => {
  return api.post("/chat/chat", { receiverId });
};

export const getAllChats = () => {
  return api.get("/chat");
};

export const createGroup = (name, participants = [], avatar) => {
  return api.post("/chat/group", { name, participants, avatar });
};

export const updateGroup = (obj, chatId) => {
  return api.patch(`/chat/group/${chatId}`, obj);
};

export const deleteGroup_api = (chatId) => {
  return api.delete(`/chat/group/${chatId}`);
};

export const addParticipantInGroup = (chatId, participantId) => {
  return api.post(`/chat/group/${chatId}/${participantId}`);
};

export const removeParticipantFromGroup = (chatId, participantId) => {
  return api.delete(`/chat/group/${chatId}/${participantId}`);
};

// <----------------------- Messages ----------------------------------->

export const getAllMessages = (chatId) => {
  return api.get(`/message/${chatId}`);
};

export const sendMessage = (chatId, content) => {
  return api.post(`/message/${chatId}`, { content });
};

// <----------------------- Video Call ----------------------------------->

export const initialiseVc_api = (chatId) => {
  return api.post(`/one-on-one-vc/start`, { chatId });
};
