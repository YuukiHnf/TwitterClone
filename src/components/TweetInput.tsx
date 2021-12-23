import { Avatar } from "@material-ui/core";
import { signOut } from "firebase/auth";
import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectUser } from "../features/userSlice";
import { auth } from "../firebase/firebase";
import styles from "./TweetInput.module.css";

const TweetInput = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  return (
    <div>
      <Avatar
        className={styles.tweet_avatar}
        src={user.photoUrl}
        onClick={async () => {
          await signOut(auth);
          dispatch(logout({}));
        }}
      />
    </div>
  );
};

export default TweetInput;
