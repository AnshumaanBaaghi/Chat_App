import {
  GETNEWFRIENDS,
  LOGIN,
  LOGOUT,
  UPDATEUSERDETAIL,
  GETSENTREQUESTS,
  GETFRIENDREQUEST,
} from "../actions/userActions";

const initialVal = {
  isAuth: false,
  userDetail: { name: "", email: "", username: "", avatar: "", userId: "" },
  friends: [],
  newUsers: [],
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

    case GETNEWFRIENDS:
      return { ...state, newUsers: payload };

    case GETSENTREQUESTS:
      return { ...state, sentRequests: payload };

    default:
      return state;
  }
};
