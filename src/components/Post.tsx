import { Avatar } from "@material-ui/core";
import React from "react";
import { useAppSelector } from "../app/hooks";
import { selectUser } from "../features/userSlice";
import { TweetType } from "./TweetInput";
import styles from "./Post.module.css";

type PostType = {
  post: TweetType;
};

const Post: React.VFC<PostType> = (props: PostType) => {
  const { post } = props;
  const users = useAppSelector(selectUser);

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
    </div>
  );
};

export default Post;
