import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Image from '../../img/store.jpg'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { auth } from '../../firebase'
import { Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import axios from '../../axios';
import { setVendor } from "../../actions/postVendor"
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundImage: `url(${Image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "120vh",
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

function SignUp({ setVendor }) {
    const history = useHistory()
    const classes = useStyles();
    const [fName, setFName] = useState("")
    const [fNameError, setFNameError] = useState("")
    const [lNameError, setLNameError] = useState("")
    const [lName, setLName] = useState("")
    const [email, setEmail] = useState("")
    const [eircode, setEircode] = useState("")
    const [eirError, setEirError] = useState("")
    const [cNameError, setCNameError] = useState("")
    const [password, setPassword] = useState("")
    const [rNoti, setRNoti] = useState(false)
    const [tcCheck, setTcCheck] = useState(false)
    const [cName, setCName] = useState("")


    const handleEirCode = (e) => {
        e.preventDefault();
        setEircode(e.target.value.trim().toUpperCase())
        var pattern = '(?:^[AC-FHKNPRTV-Y][0-9]{2}|D6W)[ -]?[0-9AC-FHKNPRTV-Y]{4}$';

        var reg = new RegExp(pattern, 'i');
        //return the first Eircode
        if (eircode.length > 3) {
            if (reg.test(e.target.value.trim())) {
                setEirError('')
            } else {
                setEirError("Invalid eir code")
            }
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        var error = false;
        if (eirError !== '' || eircode === '') {
            setEirError("Please provide EirCode")
            error = true
        }
        if (cName === '') {
            setCNameError("Please Provide a Company Name")
            error = true
        }
        if (cName.length < 4) {
            setCNameError("Please Provide a Longer Company Name")
            error = true
        }
        if (fName === '') {
            setFNameError("First Name Cannot be empty")
            error = true
        }
        if (lName === '') {
            setLNameError("Last Name Cannot be empty")
            error = true
        }
        if (error) {
            return;
        }
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                response.user.updateProfile({
                    displayName: fName + " " + lName
                }).then(() => {
                    const bodyData = new FormData()
                    bodyData.append("uid", response.user.uid)
                    bodyData.append("email", response.user.email)
                    bodyData.append("companyName", cName)
                    bodyData.append("eircode", eircode)
                    axios.post("/vendor", bodyData).then(response => {
                        if (response.status === 200) {
                            setVendor()
                            history.push("/")
                        } else {
                            alert(response.message)
                        }
                    }).catch(error => {
                        alert(error.message)
                    })

                })
            }).catch((error) => {
                console.log(error)
            });
    }

    return (
        <main className={classes.root}>
            <Container className={classes.paper} maxWidth="sm">
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up as Vendor
        </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                value={cName}
                                autoComplete="cName"
                                name="Company Name"
                                variant="outlined"
                                required
                                inputProps={{
                                    minLength: 5
                                }}
                                error={cNameError !== ''}
                                helperText={cNameError}
                                fullWidth
                                id="cName"
                                label="Company Name"
                                autoFocus
                                onChange={(e) => {
                                    if (e.target.value.length >= 4) {
                                        setCNameError("")
                                    }
                                    setCName(e.target.value)
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                value={fName}
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                error={fNameError !== ''}
                                helperText={fNameError}
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={(e) => {
                                    setFNameError("")
                                    setFName(e.target.value)
                                }}
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
                                error={lNameError !== ''}
                                helperText={lNameError}
                                autoComplete="lname"
                                value={lName}
                                onChange={(e) => {
                                    setLNameError("")
                                    setLName(e.target.value)
                                }}
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
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                inputProps={{
                                    maxLength: 7
                                }}
                                id="eircode"
                                label="EirCode"
                                name="EirCode"
                                autoComplete="eircode"
                                value={eircode}
                                error={eirError !== ''}
                                helperText={eirError}
                                onChange={handleEirCode}
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
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox color="primary" value={tcCheck} onChange={(e) => { setTcCheck(e.target.checked) }} />}
                                label="Agree to all the Terms &amp; Conditions."
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
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link className={classes.link}
                                href="/vendor-signin" variant="body2">
                                Already have an account? Sign in
                    </Link>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </main>
    );
}


export default connect(null, { setVendor })(SignUp);