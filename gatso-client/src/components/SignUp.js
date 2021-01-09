import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Image from '../img/sign-up.jpg'
import Icon from '../img/google.svg'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { auth } from '../firebase/firebaseConfig'
import { Container } from '@material-ui/core';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundImage: `url(${Image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",

    },
    paper: {
        marginTop: theme.spacing(8),
        backgroundImage: `linear-gradient(180deg, rgba(245,245,245,0.60) 0%, rgba(255,255,255,0.60) 100%)`,
        display: 'flex',
        position: "absolute",
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: "10px",
        width: "80%",
        left: "27%",
        padding: theme.spacing(2),
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
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        fontWeight: "600"
    },
    link: {
        color: theme.palette.spreadThis.text.secondary,
    },
    googleBtn: {
        backgroundColor: "#4285F4",
        "&:hover": {
            backgroundColor: "#4285F4"
        },
        fontWeight: "600",
        color: "white",
        position: "relative",
        left: "40%",
    },
    icon: {
        color: "white",
        width: "20px",
        height: "20px",
        marginRight: theme.spacing(1)
    }
}));

function SignUp() {
    const history = useHistory()
    const classes = useStyles();
    const [fName, setFName] = useState("")
    const [lName, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rNoti, setRNoti] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((user) => {
                console.log(user)
                auth.currentUser.updateProfile({
                    displayName: fName + " " + lName
                }).then(
                    history.push("/")
                )

            }).catch((error) => {
                console.log(error)
            });
    }

    const googleSignIn = (e) => {
        e.preventDefault()
        var provider = auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        auth.languageCode = 'it';
        auth.signInWithPopup(provider).then(result => {
            console.log(result)
        })
    }

    return (
        <main className={classes.root}>
            <Container className={classes.paper} maxWidth="sm">
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
        </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                value={fName}
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={(e) => { setFName(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                value={lName}
                                onChange={(e) => { setLName(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox color="primary" value={rNoti} onChange={(e) => { setRNoti(e.target.checked) }} />}
                                label="I want to receive inspiration, marketing promotions and updates via email."
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.googleBtn}
                        onClick={googleSignIn}
                    >
                        <img src={Icon} className={classes.icon} alt="googleIcon" />Google
                    </Button>

                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link className={classes.link}
                                href="/sign-in" variant="body2">
                                Already have an account? Sign in
                    </Link>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </main>
    );
}

export default connect(null, null)(SignUp)