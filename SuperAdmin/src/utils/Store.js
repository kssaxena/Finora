import { configureStore } from "@reduxjs/toolkit";
import UserInfoSlice from "./Slice/UserInfoSlice";

const store = configureStore({
  reducer: {
    UserInfo: UserInfoSlice,
  },
});

export default store;
