import { createSlice } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";

const initialState: { user: UserType } = {
  user: { uid: "", photoUrl: "", displayName: "" },
};

type UserType = {
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
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: RootStateOrAny) => state?.user.user;

export default userSlice.reducer;
