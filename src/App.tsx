import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import styples from "./App.module.css";

import { useAppDispatch, useAppSelector } from "./app/hooks";
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
  }, []);

  return <div className="App"></div>;
};

export default App;
