import React, { useState } from "react";
import { connect } from "react-redux";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { MenuItem, fade, InputBase, MenuList, Button, Paper, Popper, ClickAwayListener, Grow } from "@material-ui/core"
import { Link, useHistory } from "react-router-dom";
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { auth } from "../../firebase";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PopProduct from "../PopupBasket";
import AddIcon from '@material-ui/icons/Add';
import VendorIcon from "../../img/hand-shake.svg";

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
    ...theme.spreadThis,
    root: {
        display: "flex",
        flexDirection: "column",
    },
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        color: theme.primary,
        [theme.breakpoints.up('sm')]: {
            height: '30px',

        },
        [theme.breakpoints.up('md')]: {
            height: '60px',
        },
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    hide: {
        display: "none"
    },
    drawer: {
        justifyContent: "start",
        flexShrink: 1
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        padding: theme.spacing(2),
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: -drawerWidth,
    },
    children: {
        marginLeft: drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        margin: 'auto',
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },

    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    logo: {
        color: theme.palette.spreadThis.text.main
    },
    toggleMenu: {
        color: theme.palette.spreadThis.text.main,
        textTransform: "capitalize"
    },
    basketIcon: {
        marginLeft: "8px",
    },
    basketList: {
        maxHeight: "500px",
        maxWidth: "400px",
        overflowY: "auto",
        '&::-webkit-scrollbar': {
            width: '0'
        },
        "& li": {
            justifyContent: "center"
        }
    },
    popperBtn: {
        margin: "8px"
    }
}));

function Sidebar({ children, user, vendor }) {
    const history = useHistory()
    const classes = useStyles();
    const theme = useTheme();
    const anchorRef = React.useRef(null);
    const basketRef = React.useRef(null);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [toggleMiniBasket, setToggleMiniBasket] = useState(false)
    const prevOpen = React.useRef(toggleMenu);
    const prevBasketOpen = React.useRef(toggleMiniBasket);

    React.useEffect(() => {
        if (prevOpen.current === true && toggleMenu === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = toggleMenu;

        if (prevBasketOpen.current === true && toggleMiniBasket === false) {
            basketRef.current.focus();
        }

        prevBasketOpen.current = toggleMiniBasket;
    }, [toggleMenu, toggleMiniBasket]);

    const handleToggle = () => {
        if (!user) {
            history.push("/sign-in")
            return
        }
        setToggleMenu((prevOpen) => !prevOpen);
        setToggleMiniBasket(false)
    };
    const handleBasketToggle = () => {
        setToggleMiniBasket((prevBasketOpen) => !prevBasketOpen);
        setToggleMenu(false);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        auth.signOut()
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setToggleMenu(false);
    };

    const handleBasketClose = (event) => {
        if (basketRef.current && basketRef.current.contains(event.target)) {
            return;
        }

        setToggleMiniBasket(false);
    };

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setToggleMenu(false);
        }
    }
    return (
        <div className={classes.root}>
            <AppBar
                position="sticky"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: openDrawer
                })}
            >
                <Toolbar className={clsx(classes.toolbar)}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpenDrawer(true)}
                        edge="start"
                        className={clsx(classes.menuButton, openDrawer && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={clsx(classes.logo)} variant="h6" noWrap>
                        Gatso
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>
                    <div>
                        <Button
                            ref={anchorRef}
                            aria-controls={toggleMenu ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                            className={clsx(classes.toggleMenu)}
                        >
                            <AccountCircleIcon color="action" fontSize="large" />&nbsp;
                                {(user && user.displayName) ? `Hello, ${user.displayName}` : `Hello,     Guest`}
                        </Button>
                        {user && <Popper open={toggleMenu} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList autoFocusItem={toggleMenu} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                                <MenuItem>Profile</MenuItem>
                                                <MenuItem>Orders</MenuItem>
                                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>}
                    </div>
                    <Button
                        ref={basketRef}
                        aria-controls={toggleMenu ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleBasketToggle}
                        className={classes.basketIcon}>
                        <ShoppingCartIcon />0
                    </Button>
                    <Popper open={toggleMiniBasket} anchorEl={basketRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleBasketClose}>
                                        <MenuList className={classes.basketList} autoFocusItem={toggleMiniBasket} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                            <MenuItem onClick={handleBasketClose}>
                                                <PopProduct />
                                            </MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                            <MenuItem onClick={handleBasketClose}><PopProduct /></MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                    <Button variant="contained" color="primary" className={classes.popperBtn}>
                                        Proceed To Checkout
                                        </Button>
                                    <Button variant="contained" color="secondary">
                                        Clear
                                        </Button>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Toolbar>
            </AppBar>

            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={openDrawer}
                classes={{
                    paper: classes.drawerPaper
                }}
            >
                <div className={classes.drawerHeader}>
                    <Typography variant="h5">Menu</Typography>
                    <IconButton onClick={() => setOpenDrawer(false)}>
                        {theme.direction === "ltr" ? (
                            <ChevronLeftIcon />
                        ) : (
                                <ChevronRightIcon />
                            )}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {["Home", "Starred", "Send email", "Drafts"].map((text, index) => (
                        <MenuItem button key={text} component={Link} to={'/'}>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </MenuItem>
                    ))}
                </List>
                <Divider />

                {user == null &&
                    <MenuItem button key={"Join a Vendor"} component={Link} to={'/vendor-signup'}>
                        <ListItemIcon>
                            <img src={VendorIcon} alt="React Logo" height="32px" width="32px" />
                        </ListItemIcon>
                        <ListItemText primary={"Join a Vendor"} />
                    </MenuItem>
                }
                {user == null &&
                    <MenuItem button key={"Sign as Vendor"} component={Link} to={'/vendor-signin'}>
                        <ListItemIcon>
                            <img src={VendorIcon} alt="React Logo" height="32px" width="32px" />
                        </ListItemIcon>
                        <ListItemText primary={"Sign as Vendor"} />
                    </MenuItem>
                }

                {(user !== null && vendor) &&
                    <MenuItem button key={"Add Product"} component={Link} to={'/AddProduct'}>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Add Product"} />
                    </MenuItem>
                }
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: openDrawer
                })}>
                <div className={clsx(classes.children)}>
                    {children}
                </div>
                <div className={classes.drawerHeader} />

            </main>
        </div >
    );
}

function mapStateToProps(state) {
    return {
        user: state.user,
        vendor: state.vendor
    };
}

export default connect(mapStateToProps, null)(Sidebar);
