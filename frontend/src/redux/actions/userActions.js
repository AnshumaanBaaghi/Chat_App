// Authentication

import { friendRequests, friends, newFriends, sentRequests } from "@/api";

export const UPDATEUSERDETAIL = "UPDATEUSERDETAIL";
export const GETSENTREQUESTS = "GETSENTREQUESTS";
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

// Users
export const GETNEWFRIENDS = "GETNEWFRIENDS";
export const GETFRIENDS = "GETFRIENDS";
export const GETFRIENDREQUEST = "GETFRIENDREQUEST";

export const getNewFriends = () => {
  return async (dispatch) => {
    try {
      const new_friends = await newFriends();
      console.log("new_friends:", new_friends.data.data);
      dispatch({ type: GETNEWFRIENDS, payload: new_friends.data.data });
    } catch (error) {}
  };
};

export const getSentRequests = () => {
  return async (dispatch) => {
    try {
      const sent_Requests = await sentRequests();
      dispatch({ type: GETSENTREQUESTS, payload: sent_Requests.data.data });
    } catch (error) {
      console.log("error:", error);
    }
  };
};

export const getfriends = () => async (dispatch) => {
  try {
    const friends = await friends();
    dispatch({ type: GETFRIENDS, payload: friends.data.data });
  } catch (error) {}
};

export const getfriendRequests = () => async (dispatch) => {
  try {
    const friend_Requests = await friendRequests();
    dispatch({
      type: GETFRIENDREQUEST,
      payload: friend_Requests.data.data || [],
    });
  } catch (error) {
    console.log("error:", error);
  }
};
