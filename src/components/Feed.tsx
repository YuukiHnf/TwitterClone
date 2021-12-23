import { signOut } from "firebase/auth";
import React from "react";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/userSlice";
import { auth } from "../firebase/firebase";
import TweetInput from "./TweetInput";

const Feed = () => {
  const dispatch = useAppDispatch();

  const onSignOut = async () => {
    console.log("try:signOut");
    try {
      await signOut(auth);
      dispatch(logout({}));
      console.log("success:signOut");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      Feed
      <TweetInput />
      <button onClick={onSignOut}>SignOut</button>
    </div>
  );
};

export default Feed;
