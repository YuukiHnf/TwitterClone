import { Avatar } from "@material-ui/core";
import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  FieldValue,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
  UploadTask,
} from "firebase/storage";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, selectUser } from "../features/userSlice";
import { auth, db, storage } from "../firebase/firebase";
import styles from "./TweetInput.module.css";

type TweetType = {
  avater: string;
  image: string;
  text: string;
  timestamp: FieldValue;
  username: string;
};

const TweetInput = () => {
  //   const user = useAppSelector((state) => state.user.user);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const [tweetMsg, setTweetMsg] = useState("");
  const [tweetImage, setTweetImage] = useState<File | null>(null);

  // Imageを受け取るCallback
  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  // tweetを送信する
  const sendTweet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (tweetImage) {
        //画像あり
        //fileNameの作成
        const fileName =
          Math.random().toString(36).slice(-16) + "_" + tweetImage.name;
        //ref
        const imageRef = ref(storage, `images/${fileName}`);
        //追加
        const uploadTweetImg = uploadBytesResumable(imageRef, tweetImage);
        uploadTweetImg.on(
          "state_changed",
          () => {}, //onCanceled
          (err) => {
            //resetState
            alert(err.message);
          },
          async () => {
            // schedule
            // imageURLの取得
            const tweetImageUrl = await getDownloadURL(imageRef);
            // firestoreに格納する
            const docRef = await addDoc(collection(db, "posts"), {
              avatar: user.photoUrl,
              image: tweetImageUrl,
              text: tweetMsg,
              timeStamp: serverTimestamp(),
              username: user.displayName,
            });
          }
        );
      } else {
        //画像なし
        // upload
        const docRef = await addDoc(collection(db, "posts"), {
          avatar: user.photoUrl,
          image: "",
          text: tweetMsg,
          timeStamp: serverTimestamp(),
          username: user.displayName,
        });
      }
    } catch (e) {}
    setTweetImage(null);
    setTweetMsg("");
  };

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
