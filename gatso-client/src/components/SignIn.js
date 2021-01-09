import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Image from '../img/sign-in.jpg'
import { auth } from '../firebase/firebaseConfig'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom';
import Icon from '../img/google.svg';
import firebase from "firebase"



const useStyles = makeStyles((theme) => ({
    root: {
        //linear-gradient(180deg, rgba(221,221,221,0.41780462184873945) 0%, rgba(249,249,249,0.07886904761904767) 100%),
        backgroundImage: `url(${Image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
        // alignItems:"end"
    },
    paper: {
        position: "absolute",
        backgroundImage: `linear-gradient(180deg, rgba(245,245,245,0.60) 0%, rgba(255,255,255,0.60) 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: "80%",
        left: "27%",
        borderRadius: "10px",
        padding: theme.spacing(1),
        marginTop: theme.spacing(10),
        [theme.breakpoints.down('md')]: {
            width: "80%",
            left: "10%",
        },
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        marginTop: theme.spacing(1),
    },
    input: {
        maxHeight: "50px",
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    link: {
        color: theme.palette.spreadThis.text.secondary
    },
    googleBtn: {
        backgroundColor: "#4285F4",
        "&:hover": {
            backgroundColor: "#4285F4"
        },
        fontWeight: "600",
        color: "white",
        position: "relative",
        left: "39%",
    },
    icon: {
        color: "white",
        width: "20px",
        height: "20px",
        marginRight: theme.spacing(1)
    }
}));

function SignIn() {
    const history = useHistory()
    const classes = useStyles();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const handleSignIn = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password).then((authRes) => {
            console.log(authRes)
            history.push("/")
        }).catch((error) => {
            console.log(error)
        })
    }
    const googleSignIn = (e) => {
        e.preventDefault()
        var provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(result => {
            history.push("/")
        })
    }
    return (
        <div className={clsx(classes.root)}>
            <Container className={clsx(classes.paper)} maxWidth="sm">
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                     </Typography>
                <Container>
                    <form className={classes.form} noValidate onSubmit={handleSignIn}>
                        <TextField
                            className={classes.input}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            autoFocus
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <TextField
                            className={classes.input}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    value={rememberMe}
                                    onChange={(e) => { setRememberMe(e.target.checked) }} />}
                            label="Remember me"
                            className={classes.input} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>
                        <Container style={{ textAlign: "center", marginBottom: "8px" }}>
                            <i>---or---</i>
                        </Container>
                        <Button
                            variant="contained"
                            className={classes.googleBtn}
                            onClick={googleSignIn}
                        >
                            <img src={Icon} className={classes.icon} alt="googleIcon" />Google
                    </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link className={classes.link} onClick={() => { console.log("event reset") }} variant="body2">
                                    Forgot password?
                        </Link>
                            </Grid>
                            <Grid item>
                                <Link className={classes.link} href="/sign-up" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Container>
        </div >
    )
}

export default SignIn;
