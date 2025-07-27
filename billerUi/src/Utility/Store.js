import { configureStore } from "@reduxjs/toolkit";
import UserInfoSlice from "./Slice/UserInfoSlice";
import CategoryList from "../Utility/Slice/CategorySlice";

const store = configureStore({
  reducer: {
    UserInfo: UserInfoSlice,
    categoryList: CategoryList,
  },
});

export default store;
