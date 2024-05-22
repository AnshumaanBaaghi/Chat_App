// <--------------------------------Authentication---------------------------------------->

import {
  friendRequests,
  friends,
  getAllChats,
  getOrCreateChat_api,
  newFriends,
  sentRequests,
} from "@/api";

export const UPDATEUSERDETAIL = "UPDATEUSERDETAIL";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const updateUserDetail = (data) => {
  return { type: UPDATEUSERDETAIL, payload: data };
};

export const login = () => {
  return { type: LOGIN };
};
export const logout = () => {
  return { type: LOGOUT };
};

// <--------------------------------Users---------------------------------------->

export const UPDATENEWFRIENDS = "UPDATENEWFRIENDS";
export const UPDATESENTREQUESTS = "UPDATESENTREQUESTS";
export const UPDATEFRIENDS = "UPDATEFRIENDS";
export const UPDATEFRIENDREQUEST = "UPDATEFRIENDREQUEST";
export const UPDATECHATS = "UPDATECHATS";
export const UPDATESELECTEDCHAT = "UPDATESELECTEDCHAT";

export const getNewFriends = () => {
  return async (dispatch) => {
    try {
      const new_friends = await newFriends();
      dispatch({ type: UPDATENEWFRIENDS, payload: new_friends.data.data });
    } catch (error) {}
  };
};

export const getSentRequests = () => {
  return async (dispatch) => {
    try {
      const sent_Requests = await sentRequests();
      dispatch({ type: UPDATESENTREQUESTS, payload: sent_Requests.data.data });
    } catch (error) {
      console.log("error:", error);
    }
  };
};

export const getfriends = () => async (dispatch) => {
  try {
    const friendsArr = await friends();
    dispatch({ type: UPDATEFRIENDS, payload: friendsArr.data.data });
  } catch (error) {
    console.log("error:", error);
  }
};

export const getfriendRequests = () => async (dispatch) => {
  try {
    const friend_Requests = await friendRequests();
    dispatch({
      type: UPDATEFRIENDREQUEST,
      payload: friend_Requests.data.data || [],
    });
  } catch (error) {
    console.log("error:", error);
  }
};

export const getChats = () => async (dispatch) => {
  try {
    const chats = await getAllChats();
    console.log("all chats:", chats.data.data);
    dispatch({
      type: UPDATECHATS,
      payload: chats.data.data || [],
    });
  } catch (error) {
    console.log("error:", error);
  }
};

export const getOrCreateChat = (receiverId) => async (dispatch) => {
  try {
    const chat = await getOrCreateChat_api(receiverId);
    console.log("chat:", chat.data.data);
    chat.data.data &&
      dispatch({
        type: UPDATECHATS,
        payload: chat.data.data || {},
      });
  } catch (error) {
    console.log("error:", error);
  }
};

// To avoid unneccessary requests
export const updateNewFriends = (payload) => {
  return { type: UPDATENEWFRIENDS, payload };
};

export const updateSentRequests = (payload) => {
  return { type: UPDATESENTREQUESTS, payload };
};

export const updateFriendRequests = (payload) => {
  return { type: UPDATEFRIENDREQUEST, payload };
};

export const updateFriends = (payload) => {
  return { type: UPDATEFRIENDS, payload };
};

export const updateChats = (payload) => {
  return { type: UPDATECHATS, payload };
};

export const updateSelectedChat = (payload) => {
  return { type: UPDATESELECTEDCHAT, payload };
};
