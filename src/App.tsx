import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import styles from "./App.module.css";

import { useAppDispatch, useAppSelector } from "./app/hooks";
import Auth from "./components/Auth";
import Feed from "./components/Feed";
import { login, logout } from "./features/userSlice";
import { auth } from "./firebase/firebase";

const App: React.VFC = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (users) => {
      if (users) {
        dispatch(
          login({
            uid: users.uid,
            photoUrl: users.photoURL ?? "",
            displayName: users.displayName ?? "",
          })
        );
      } else {
        dispatch(logout);
      }
    });

    return () => {
      unSub();
    };
  }, [dispatch]);

  return (
    <>
      {user.uid ? (
        <div className={styles.app}>
          {" "}
          <Feed />{" "}
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
