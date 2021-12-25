import { Avatar, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/userSlice";
import { TweetType } from "./TweetInput";
import styles from "./Post.module.css";
import SendIcon from "@material-ui/icons/Send";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import MessageIcon from "@material-ui/icons/Send";

type PostType = {
  post: TweetType;
};

type ReplayType = {
  id: string;
  avatar: string;
  text: string;
  timeStamp: Timestamp;
  username: string;
};

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
}));

const Post: React.VFC<PostType> = (props: PostType) => {
  const { post } = props;
  const user = useAppSelector(selectUser);
  const classes = useStyles();

  const [comment, setComment] = useState("");
  const [replays, setReplays] = useState<Array<ReplayType>>([]);

  const [openReplay, setOpenReplay] = useState(false);

  useEffect(() => {
    // この投稿のreplayのCollection
    const replayCollection = collection(
      doc(collection(db, "posts"), post.id),
      "comments"
    );
    // それらのquery
    const q = query(replayCollection, orderBy("timeStamp", "asc"));
    // replay stateに情報を入れる
    const unSub = onSnapshot(q, (snapshot) => {
      setReplays(
        snapshot.docs.map((snap) => ({
          id: snap.id,
          avatar: snap.data().avatar,
          text: snap.data().text,
          timeStamp: snap.data().timeStamp,
          username: snap.data().username,
        }))
      );
    });

    return () => {
      unSub();
    };
  }, [post.id]);

  //   console.log(`${post.text} : reps are ${replays}`);

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
      <div className={styles.post_avatar}>
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
        {post.image && (
          <div className={styles.post_tweetImage}>
            <img src={post.image} alt="tweet" />
          </div>
        )}
        <h4
          onClick={() => setOpenReplay(!openReplay)}
          style={{ color: "#00bfff" }}
        >
          Replay...
        </h4>
        {openReplay && (
          <>
            {replays.map((com) => (
              <div key={com.id} className={styles.post_comment}>
                <Avatar src={com.avatar} className={classes.small} />

                <span className={styles.post_commentUser}>@{com.username}</span>
                <span className={styles.post_commentText}>{com.text} </span>
                <span className={styles.post_headerTime}>
                  {new Date(com.timeStamp?.toDate()).toLocaleString()}
                </span>
              </div>
            ))}
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
                  className={
                    comment ? styles.post_button : styles.post_buttonDisable
                  }
                  type="submit"
                >
                  <SendIcon className={styles.post_sendIcon} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Post;
