import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { userReducer } from "@/redux/reducer/userReducer";
import { thunk } from "redux-thunk";
import { socketReducer } from "@/redux/reducer/socketReducer";
const rootReducer = combineReducers({
  user: userReducer,
  socket: socketReducer,
});
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
