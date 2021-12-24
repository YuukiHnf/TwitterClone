import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/userSlice";
import { TweetType } from "./TweetInput";
import styles from "./Post.module.css";
import SendIcon from "@material-ui/icons/Send";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

type PostType = {
  post: TweetType;
};

const Post: React.VFC<PostType> = (props: PostType) => {
  const { post } = props;
  const user = useAppSelector(selectUser);

  const [comment, setComment] = useState("");
  const onNewComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // この投稿のDocをとってくる
    const ptrPostDoc = doc(collection(db, "posts"), post.id);

    // この投稿のDocのSubCollectionのDocをとってくる
    const subCollection = collection(ptrPostDoc, "comments");

    // コレクションから、データを追加する
    const docRef = await addDoc(subCollection, {
      avatar: user.photoUrl,
      text: comment,
      timeStamp: serverTimestamp(),
      username: user.displayName,
    });
    setComment("");
  };

  return (
    <div className={styles.post}>
      <div className={styles.post_avatart}>
        <Avatar src={post.avatar} />
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.post_headerUser}>@{post.username}</span>
              <span className={styles.post_headerTime}>
                {new Date(post.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className={styles.post_tweet}>
            <p>{post.text}</p>
          </div>
        </div>
      </div>
      {post.image && (
        <div className={styles.post_tweetImage}>
          <img src={post.image} alt="tweet" />
        </div>
      )}
      <form onSubmit={onNewComment}>
        <div className={styles.post_form}>
          <input
            className={styles.post_input}
            type="text"
            placeholder="Type new comment..."
            value={comment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setComment(e.target.value);
            }}
          />
          <button
            disabled={!comment}
            className={comment ? styles.post_button : styles.post_buttonDisable}
            type="submit"
          >
            <SendIcon className={styles.post_sendIcon} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Post;
