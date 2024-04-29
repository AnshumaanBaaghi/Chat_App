import {
  GETNEWFRIENDS,
  LOGIN,
  LOGOUT,
  UPDATEUSERDETAIL,
  GETSENTREQUESTS,
  GETFRIENDREQUEST,
  UPDATENEWFRIENDS,
  UPDATESENTREQUESTS,
  UPDATEFRIENDREQUEST,
  GETFRIENDS,
  UPDATEFRIENDS,
} from "../actions/userActions";

const initialVal = {
  isAuth: null,
  userDetail: { name: "", email: "", username: "", avatar: "", userId: "" },
  friends: [],
  newUsers: ["hello"],
  friendRequests: [],
  sentRequests: [],
};

export const userReducer = (state = initialVal, { type, payload }) => {
  switch (type) {
    case UPDATEUSERDETAIL:
      return { ...state, userDetail: { ...state.userDetail, ...payload } };

    case LOGIN:
      return { ...state, isAuth: true };

    case LOGOUT:
      return initialVal;

    case GETFRIENDREQUEST:
      return { ...state, friendRequests: payload };

    case GETFRIENDS:
      return { ...state, friends: payload };

    case GETNEWFRIENDS:
      return { ...state, newUsers: payload };

    case GETSENTREQUESTS:
      return { ...state, sentRequests: payload };

    case UPDATENEWFRIENDS:
      return { ...state, newUsers: payload };

    case UPDATESENTREQUESTS:
      return { ...state, sentRequests: payload };

    case UPDATEFRIENDREQUEST:
      return { ...state, friendRequests: payload };

    case UPDATEFRIENDS:
      return { ...state, friends: payload };

    default:
      return state;
  }
};
