import loaderSlice from "./loaderSlice";
import userSlice from "./usersSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {
        users: userSlice,
        loader: loaderSlice
    }
});

export default store;
