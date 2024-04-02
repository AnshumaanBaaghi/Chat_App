import {
  GETNEWFRIENDS,
  LOGIN,
  LOGOUT,
  UPDATEUSERDETAIL,
} from "../actions/userActions";

const initialVal = {
  isAuth: false,
  userDetail: { name: "", email: "", username: "", avatar: "" },
  friends: [],
  newUsers: [],
  friendRequests: [],
};

export const userReducer = (state = initialVal, { type, payload }) => {
  switch (type) {
    case UPDATEUSERDETAIL:
      return { ...state, userDetail: { ...state.userDetail, ...payload } };

    case LOGIN:
      return { ...state, isAuth: true };

    case LOGOUT:
      return initialVal;

    case GETNEWFRIENDS:
      return { ...state, newUsers: payload };

    default:
      return state;
  }
};
