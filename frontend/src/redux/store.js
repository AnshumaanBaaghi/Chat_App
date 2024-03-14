import { legacy_createStore } from "redux";
import { userReducer } from "./reducer/userReducer";

export const store = legacy_createStore(userReducer);
