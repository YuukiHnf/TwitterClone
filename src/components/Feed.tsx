import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/userSlice";
import { auth, db } from "../firebase/firebase";
import TweetInput, { TweetType } from "./TweetInput";
import styles from "./Feed.module.css";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Avatar } from "@material-ui/core";
import Post from "./Post";

const Feed: React.VFC = () => {
  // TweetTypeを拡張したい
  const [posts, setPosts] = useState<Array<TweetType>>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // collectionから、取り出したいqueryを作成する
    // TimeStampで降順に並べてそれを上から表示する
    const q = query(collection(db, "posts"), orderBy("timeStamp", "desc"));

    // queryからDocsをSnapshotとして受け取る
    const unSub = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          avatar: doc.data().avatar,
          id: doc.id,
          image: doc.data().image,
          text: doc.data().text,
          timestamp: doc.data().timeStamp,
          username: doc.data().username,
        }))
      );
    });

    return () => {
      unSub();
    };
  }, []);
  console.log(posts);

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
    <div className={styles.feed}>
      <TweetInput />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Feed;
