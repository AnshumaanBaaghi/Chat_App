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

//<-------------------------------------------------Chats------------------------------------------------->
export const getOrCreateChat_api = (receiverId) => {
  return api.post("/chat/chat", { receiverId });
};

export const getAllChats = () => {
  return api.get("/chat");
};

export const createGroup = (name, participants = []) => {
  return api.post("/chat/group", { name, participants });
};

export const renameGroup = (name, chatId) => {
  return api.patch(`/chat/group/${chatId}`, { name });
};

export const deleteGroup = (chatId) => {
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
