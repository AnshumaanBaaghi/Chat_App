import { applyMiddleware, legacy_createStore } from "redux";
import { userReducer } from "./reducer/userReducer";
import { thunk } from "redux-thunk";

export const store = legacy_createStore(userReducer, applyMiddleware(thunk));
