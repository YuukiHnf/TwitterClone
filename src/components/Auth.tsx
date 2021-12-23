import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Grid,
  Typography,
  makeStyles,
  Modal,
  IconButton,
  Box,
} from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";
import CameraIcon from "@material-ui/icons/Camera";
import EmailIcon from "@material-ui/icons/Email";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import styles from "./Auth.module.css";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, provider, storage } from "../firebase/firebase";
import { rejects } from "assert";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAppDispatch } from "../app/hooks";
import { updateUserProfile } from "../features/userSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  modal: {
    outline: "none",
    position: "absolute",
    width: 400,
    borderRadius: 10,
    backgroundColor: "white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10),
  },
}));

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const Auth: React.VFC = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const [userName, setUserName] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const dispatch = useAppDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const sendResetEmail = () => {
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        console.log("[RESETPASS] : send email");
      })
      .catch((e) => {
        alert(`[MyError] : ${e.code} error onreset email : ${e.message}`);
      });
  };

  const onChangeImageHanlder = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const signInEmail = async () => {
    try {
      const usrCredient = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("[Success] : ", usrCredient.user);
    } catch (e: any) {
      alert(`[MyAuthWithEmail] : ${e.message}`);
    }
  };

  const signUpEmail = async () => {
    try {
      const usrCredient = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      let url = ""; //image URL
      if (avatarImage) {
        var fileName =
          Math.random().toString(36).slice(-16) + "_" + avatarImage.name;
        //crate reference
        const storageRef = ref(storage, `avatar/${fileName}`);
        // upload image
        await uploadBytes(storageRef, avatarImage);
        // urlを取得する
        url = await getDownloadURL(storageRef);
        console.log("[Success] : Upload Image : ", url);
      }
      // user情報をUploadする
      await updateProfile(usrCredient.user, {
        displayName: userName,
        photoURL: url,
      })
        .then(() => {
          console.log("[Success] : updateProfile");
        })
        .catch(() => {
          console.log("[MyError] : updateProfile");
        });
      //stateに情報を更新する
      dispatch(
        updateUserProfile({
          displayName: userName,
          photoUrl: url,
        })
      );
      console.log("[Fin User] : ", usrCredient.user);
    } catch (e: any) {
      alert(`[MyAuthWithEmail] : ${e.message}`);
    }
  };

  const onClickLoginOrRegister: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    isLogin ? signInEmail() : signUpEmail();
  };

  const signInGoogle = async () => {
    // await signInWithPopup(auth, provider).catch((err) =>
    //   alert(`[MyAuthWithGoogle] : ${err.message}`)
    // );
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
    } catch (e: any) {
      alert(`[MyAuthWithGoogleError] : ${e.message}`);
    }
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isLogin ? "Login" : "Register"}
          </Typography>
          <form className={classes.form} noValidate>
            {!isLogin && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="User name"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
                <Box textAlign="center">
                  <IconButton>
                    <label>
                      <AccountCircleIcon
                        fontSize="large"
                        className={
                          avatarImage
                            ? styles.login_addIconLoaded
                            : styles.login_addIcon
                        }
                      />
                      <input
                        className={styles.login_hiddenIcon}
                        type="file"
                        onChange={onChangeImageHanlder}
                      />
                    </label>
                  </IconButton>
                </Box>
              </>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <Button
              disabled={
                isLogin
                  ? !email || password.length < 6
                  : !userName || !email || password.length < 6
              }
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              startIcon={<EmailIcon />}
              onClick={onClickLoginOrRegister}
            >
              {isLogin ? "Login" : "Register"}
            </Button>
            <Grid container>
              <Grid item xs>
                <span
                  className={styles.login_reset}
                  onClick={() => setOpenModal(true)}
                >
                  Forgot password?
                </span>
              </Grid>
              <Grid item>
                <span
                  className={styles.login_toggleMode}
                  onClick={() => {
                    setIsLogin(!isLogin);
                  }}
                >
                  {isLogin ? "Create new account?" : "Back to Login"}
                </span>
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={signInGoogle}
            >
              Sign In With Google
            </Button>
          </form>
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div style={getModalStyle()} className={classes.modal}>
              <div className={styles.login_modal}>
                <TextField
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="email"
                  name="email"
                  label="reset E-mail"
                  value={resetEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setResetEmail(e.target.value);
                  }}
                />
                <IconButton onClick={sendResetEmail}>
                  <SendIcon />
                </IconButton>
              </div>
            </div>
          </Modal>
        </div>
      </Grid>
    </Grid>
  );
};

export default Auth;
