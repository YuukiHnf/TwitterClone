import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import { RootState } from "../app/store";

const initialState: { user: UserType } = {
  user: { uid: "", photoUrl: "", displayName: "" },
};

export type UserType = {
  uid: string;
  photoUrl: string;
  displayName: string;
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: { payload: UserType }) => {
      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = initialState.user;
    },
    updateUserProfile: (
      state,
      action: PayloadAction<Omit<UserType, "uid">>
    ) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoUrl = action.payload.photoUrl;
    },
  },
});

export const { login, logout, updateUserProfile } = userSlice.actions;

export const selectUser = (state: RootState) => state?.user.user;

export default userSlice.reducer;
