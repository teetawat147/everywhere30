import React, { useState, useEffect, useRef } from "react";
import {  Route, useHistory, Link, Switch } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { getCurrentUser, logout } from "./services/auth.service";
import Login from "./components/Login";
import LineLogin from "./components/LineLoginCallback";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import clsx from 'clsx';
import { makeStyles,useTheme  } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import WcIcon from '@material-ui/icons/Wc';
import HomeIcon from '@material-ui/icons/Home';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import SearchCID from "./components/SearchCID";
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    "& .MuiToolbar-root h6":{width:'100%'},
    "& .navMenu":{
      position: 'absolute',
      right: '24px'
    },
    "& .MuiAppBar-colorSecondary": {
      color: "#fff",
      backgroundColor : "#2e2e37"
    },
    "& a.navbar-brand, .navMenu a":{color: '#fdfeff',textDecoration:'none'},
    "& a.navbar-brand:hover, .navMenu a:hover":{color: '#e0e0e0',textDecoration:'none'},
    "& .MuiDrawer-root a":{color: 'rgba(0, 0, 0, 0.87)',textDecoration:'none'},
    "& .MuiDrawer-root a:hover":{color: 'rgba(0, 0, 0, 0.87)',textDecoration:'none'},
    "& .MuiButton-root:hover":{backgroundColor:'#ffffff0f'},
    "& .MuiButton-root":{marginLeft:'5px'}
  },
  popupMenuLink:{
    "& a":{color: 'rgba(0, 0, 0, 0.87)',textDecoration:'none'},
    "& a:hover":{textDecoration:'none'}
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  menuButtonIconClosed: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    transform: "rotate(0deg)"
  },
  menuButtonIconOpen: {
    transition: theme.transitions.create(["transform"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    transform: "rotate(180deg)"
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(),
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  avatarSmall: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

const App = () => {
  const redirect = useHistory();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [logined, setLogined] = useState(false);
  const [isLineLogin, setIsLineLogin] = useState(false);
  const [userFullname, setUserFullname] = useState('');
  const [mobileView,setMobileView] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
    setMobileView(mobile);
  });
  useEffect(() => {
    if (currentUser !== null) {
      if (currentUser.user.fullname !== null && typeof currentUser.user.fullname !== 'undefined') {
        setUserFullname(currentUser.user.fullname);
      }
      if(currentUser.user.picture !== null && typeof currentUser.user.picture !=='undefined'){
        setIsLineLogin(true);
        console.log("When Line login : ",isLineLogin)
      }
      console.log("When Simple login line login is : ",isLineLogin)
      setLogined(true);
      console.log(currentUser.user);
    } else {
      setCurrentUser(getCurrentUser());
      if (currentUser == null){
        setIsLineLogin(false);
        setLogined(false);
      }
    }
  }, [currentUser]);
  const changeLoginStatus = (status) => {
    setLogined(status);
    setCurrentUser(getCurrentUser());
    if(currentUser !== null && currentUser.user.picture !== null && typeof currentUser.user.picture !=='undefined'){
      setIsLineLogin(false);
    }
    if (status === false) {
      redirect.push("/login");
    }
  }
  const logOut = (e) => {
    e.preventDefault();
    logout(changeLoginStatus);
    handleClose();
  };

  return (
    <div className={classes.root}>
      <AppBar 
        position="fixed" 
        color="secondary" 
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
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            <Link to={"/"} className="navbar-brand">R8AnyWhere</Link>
          </Typography>
          
          {(logined) ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {(!isLineLogin)?(
                  <AccountCircle />
                ):(
                  <Avatar className={classes.avatarSmall} src={(currentUser!=null)?currentUser.user.picture:''} />
                )}
                
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openMenu}
                onClose={handleClose}
                className={classes.popupMenuLink}
              >
                <Link to={"/profile"}>
                  <MenuItem onClick={handleClose}>ข้อมูลส่วนตัว</MenuItem>
                </Link>
                <MenuItem onClick={logOut}>ออกจากระบบ</MenuItem>
              </Menu>
            </div>
          ):(
            (!mobileView)&&(
              (!logined) ? (
                <div className="navMenu">
                  <Link to={"/login"}>
                    <Button color="inherit"><LockOpenIcon style={{marginRight:'5px'}}/> เข้าสู่ระบบ</Button>
                  </Link>
                  <Link to={"/register"}>
                    <Button color="inherit"><PersonAddIcon style={{marginRight:'5px'}}/> ลงทะเบียน</Button>
                  </Link>
                </div>
              ):(
                <div className="navMenu">
                  <Button color="inherit" onClick={logout}><ExitToAppIcon style={{marginRight:'5px'}} /> ออกจากระบบ</Button>
                </div>
              )
            )
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link to={"/"}>
            <ListItem button key="หน้าหลัก">
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="หน้าหลัก" />
            </ListItem>
          </Link>
          {(logined) && (
            <Link to={"/"}>
              <ListItem button key="ข้อมูลผู้ป่วย">
                <ListItemIcon><WcIcon /></ListItemIcon>
                <ListItemText primary="ข้อมูลผู้ป่วย" />
              </ListItem>
            </Link>
          )}
        </List>
        {(mobileView)&&(<Divider />)}
        {(mobileView)&&(
          (!logined) ? (
            <List>
              <Link to={"/login"}>
                <ListItem button key="เข้าสู่ระบบ">
                  <ListItemIcon><LockOpenIcon /></ListItemIcon>
                  <ListItemText primary="เข้าสู่ระบบ" />
                </ListItem>
              </Link>
              <Link to={"/register"}>
                <ListItem button key="ลงทะเบียน">
                  <ListItemIcon><PersonAddIcon /></ListItemIcon>
                  <ListItemText primary="ลงทะเบียน" />
                </ListItem>
              </Link>
            </List>
          ):(
            <List>
              <Link to={"/logout"} onClick={logOut}>
                <ListItem button key="ออกจากระบบ">
                  <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                  <ListItemText primary="ออกจากระบบ" />
                </ListItem>
                </Link>
            </List>
          )
          
        )}
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.toolbar} />
        <Switch>
          {(logined) && (
            <Route exact path='/' component={SearchCID} />
          )}
          <Route path='/home' component={Home} />
          <Route path='/register' component={Register} />
          <Route path='/profile' component={Profile} />
          <Route path='/login' render={() => <Login changeLoginStatus={changeLoginStatus} />} />
          <Route path='/linelogin' render={() => <LineLogin changeLoginStatus={changeLoginStatus} />} />
        </Switch>
      </main>
    </div >
  );
};

export default App;
