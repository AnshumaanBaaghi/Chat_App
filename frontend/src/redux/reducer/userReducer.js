import {
  LOGIN,
  LOGOUT,
  UPDATEUSERDETAIL,
  UPDATENEWFRIENDS,
  UPDATESENTREQUESTS,
  UPDATEFRIENDREQUEST,
  UPDATEFRIENDS,
  UPDATECHATS,
  UPDATESELECTEDCHAT,
} from "../actions/userActions";

const initialVal = {
  isAuth: null,
  userDetail: { name: "", email: "", username: "", avatar: "", userId: "" },
  friends: [],
  newUsers: [],
  friendRequests: [],
  sentRequests: [],
  chats: [],
  selectedChat: null,
};

export const userReducer = (state = initialVal, { type, payload }) => {
  switch (type) {
    case UPDATEUSERDETAIL:
      return { ...state, userDetail: { ...state.userDetail, ...payload } };

    case LOGIN:
      return { ...state, isAuth: true };

    case LOGOUT:
      return initialVal;

    case UPDATENEWFRIENDS:
      return { ...state, newUsers: payload };

    case UPDATESENTREQUESTS:
      return { ...state, sentRequests: payload };

    case UPDATEFRIENDREQUEST:
      return { ...state, friendRequests: payload };

    case UPDATEFRIENDS:
      return { ...state, friends: payload };

    case UPDATECHATS:
      return { ...state, chats: payload };

    case UPDATESELECTEDCHAT:
      return { ...state, selectedChat: payload };

    default:
      return state;
  }
};
