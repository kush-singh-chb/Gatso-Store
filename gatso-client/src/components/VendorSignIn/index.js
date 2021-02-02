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
import Image from '../../img/store.jpg'
import { auth } from '../../firebase'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom';



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
}));

function VendorSignIn() {
    const history = useHistory()
    const [pageError, setPageError] = useState('')
    const classes = useStyles();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const handleSignIn = (e) => {
        e.preventDefault()
        auth.signInWithEmailAndPassword(email, password).then((authRes) => {
            history.push("/")
        }).catch((error) => {
            console.log(error);
            setPageError("User or Password Incorrect")
        })
    }
    return (
        <div className={clsx(classes.root)}>
            <Container className={clsx(classes.paper)} maxWidth="sm">
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in as Vendor
                </Typography>
                {(pageError !== '') ? <Typography color="error">{pageError}</Typography> : ''}
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
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign In
                        </Button>

                        <Grid container>
                            <Grid item xs>
                                <Link className={classes.link} onClick={() => { console.log("event reset") }} variant="body2">
                                    Forgot password?
                        </Link>
                            </Grid>
                            <Grid item>
                                <Link className={classes.link} href="/vendor-signup" variant="body2">
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

export default VendorSignIn;
