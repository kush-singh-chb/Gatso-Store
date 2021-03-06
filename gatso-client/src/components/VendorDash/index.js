import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { connect } from 'react-redux';
import { auth } from '../../firebase';
import { Button, CircularProgress } from '@material-ui/core';
import AddProductIcon from "../../img/add.svg"
import MainIcon from "../../img/main.svg"
import Main from "../VendorMain/index"
import VendorCategory from "../VendorCategory"
import { setThemeUser } from '../../actions/postTheme';
import { Switch, BrowserRouter, Route, Link } from "react-router-dom";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'noWrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    session: {
        marginLeft: "auto",
        color: theme.palette.spreadThis.text.main
    },
    wrapper: {
        position: "relative"
    },
    progressDiv: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    }

}));


function VendorDash({ user, children, setThemeUser }) {
    const classes = useStyles();
    const theme = useTheme();
    const [showProgress, setShowProgress] = useState(false)
    const [open, setOpen] = useState(false);


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                        Vendor Dasboard: {user?.displayName}
                    </Typography>
                    <Button className={clsx(classes.session)} onClick={e => {
                        auth.signOut()
                        setThemeUser()
                    }}>SignOut</Button>
                </Toolbar>
            </AppBar>
            <BrowserRouter>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button key="Main" component={Link} to={"/"}>
                        <ListItemIcon><img src={MainIcon} alt="" className="src" height="22px" width="22px" /></ListItemIcon>
                        <ListItemText primary="Main" />
                    </ListItem>
                    <ListItem button key="Category" component={Link} to={"/Category"}>
                        <ListItemIcon><img src={AddProductIcon} alt="" className="src" height="22px" width="22px" /></ListItemIcon>
                        <ListItemText primary="Category" />
                    </ListItem>
                    <ListItem button key="Orders">
                        <ListItemIcon><img src={AddProductIcon} alt="" className="src" height="22px" width="22px" /></ListItemIcon>
                        <ListItemText primary="Orders" />
                    </ListItem>
                    <ListItem button key="Payments">
                        <ListItemIcon><img src={AddProductIcon} alt="" className="src" height="22px" width="22px" /></ListItemIcon>
                        <ListItemText primary="Payments" />
                    </ListItem>
                    <ListItem button key="Current Inventory">
                        <ListItemIcon><img src={AddProductIcon} alt="" className="src" height="22px" width="22px" /></ListItemIcon>
                        <ListItemText primary="Current Inventory" />
                    </ListItem>

                </List>
                <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <div className={classes.wrapper}>
                    {showProgress && <CircularProgress className={classes.progressDiv} />}
                <Switch>
                    <Route path="/Category" render={() => <VendorCategory key={"Category"} setShowProgress={setShowProgress} />} />
                    <Route path="/" render={() => <Main  key={"Main"} setShowProgress={setShowProgress} />} />
                </Switch>
                </div>
            </main>
            </BrowserRouter>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        user: state.user,
        vendor: state.vendor
    };
}

export default connect(mapStateToProps, { setThemeUser })(VendorDash);