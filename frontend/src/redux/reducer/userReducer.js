import { LOGIN, LOGOUT, UPDATEUSERDETAIL } from "../actions/userActions";

const initialVal = {
  isAuth: false,
  userDetail: { email: "", username: "", avatar: "" },
};

export const userReducer = (state = initialVal, { type, payload }) => {
  switch (type) {
    case UPDATEUSERDETAIL:
      return { ...state, userDetail: { ...state.userDetail, ...payload } };

    case LOGIN:
      return { ...state, isAuth: true };

    case LOGOUT:
      return { ...state, isAuth: false };

    default:
      return state;
  }
};
