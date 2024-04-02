// Authentication

import { friendRequests, friends, newFriends } from "@/api";

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

// Users
export const GETNEWFRIENDS = "GETNEWFRIENDS";
export const GETFRIENDS = "GETFRIENDS";
export const GETFRIENDREQUEST = "GETFRIENDREQUEST";

export const getNewFriends = () => async (dispatch) => {
  try {
    const new_friends = await newFriends();
    dispatch({ type: GETNEWFRIENDS, payload: new_friends.data.data });
  } catch (error) {}
};

export const getfriends = () => async (dispatch) => {
  try {
    const friends = await friends();
    dispatch({ type: GETFRIENDS, payload: friends.data.data });
  } catch (error) {}
};

export const getfriendRequests = () => async (dispatch) => {
  try {
    const friendRequests = await friendRequests();
    dispatch({ type: GETFRIENDREQUEST, payload: friendRequests.data.data });
  } catch (error) {}
};
