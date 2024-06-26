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
  UPDATEUNREADMESSAGES,
} from "../actions/userActions";

const initialVal = {
  isAuth: null,
  userDetail: {
    name: "",
    email: "",
    username: "",
    avatar: "",
    _id: "",
  },
  friends: [],
  newUsers: [],
  friendRequests: [],
  sentRequests: [],
  chats: [],
  selectedChat: null,
  unreadMessages: {},
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

    case UPDATEUNREADMESSAGES:
      return { ...state, unreadMessages: payload };

    default:
      return state;
  }
};
