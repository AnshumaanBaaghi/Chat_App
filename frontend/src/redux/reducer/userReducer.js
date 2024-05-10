import {
  LOGIN,
  LOGOUT,
  UPDATEUSERDETAIL,
  UPDATENEWFRIENDS,
  UPDATESENTREQUESTS,
  UPDATEFRIENDREQUEST,
  UPDATEFRIENDS,
  UPDATECHATS,
} from "../actions/userActions";

const initialVal = {
  isAuth: null,
  userDetail: { name: "", email: "", username: "", avatar: "", userId: "" },
  friends: [],
  newUsers: ["hello"],
  friendRequests: [],
  sentRequests: [],
  chats: [],
  selectedChat: [],
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

    default:
      return state;
  }
};
