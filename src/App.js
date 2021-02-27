/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {  Route, Link, Switch } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import clsx from 'clsx';
import { makeStyles,useTheme  } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
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

import HomeIcon from '@material-ui/icons/Home';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';

import { getCurrentUser,getPermissions } from "./services/auth.service";
import logo from "./images/logo192.png";
import { ConfirmProvider } from 'material-ui-confirm';
import {mainRoute,sideBarRoute} from './routes/index';
import useGlobal from "./store";
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
    // "& .MuiButton-root:hover":{backgroundColor:'#ffffff0f'},
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
  logo: {
    maxWidth: 40,
    marginRight: '10px'
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
  const [globalState, globalActions] = useGlobal();
  // const [role,setRole] = useState(getPermissions());
  const [mobileView,setMobileView] = useState(false);
  const classes = useStyles();
  const theme = useTheme();

  // Sidebar State
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleDrawerOpen = () => {setOpen(true)};
  const handleDrawerClose = () => {setOpen(false)};
  const handleMenu = (event) => {setAnchorEl(event.currentTarget)};
  const handleClose = () => {setAnchorEl(null)};

  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
    setMobileView(mobile);
    if(Object.keys(globalState.currentUser).length===0){
      // กรณี refresh หน้าเว็บให้ไป get localstorage มาใส่ใน global state
      let CU = getCurrentUser();
      globalActions.setCurrentUser(CU);
    }
    if(globalState.userRole==='noRole'){
      // กรณี refresh หน้าเว็บให้ไป get localstorage มาใส่ใน global state
      let UR = getPermissions();
      globalActions.setUserRole(UR);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  useEffect(() => {
    if(globalState.currentUser!=null){
      if (Object.keys(globalState.currentUser).length!==0) { // ถ้ามีข้อมูล user ใน global state
        if(globalState.currentUser.user.picture !== null && typeof globalState.currentUser.user.picture !=='undefined'){ // ถ้ามีรูปภาพ line profile
          globalActions.setIsLineLogin(true); // เปลี่ยนสถานะ linelogin ใน global state = true
        }
        globalActions.changeLoginStatus(true); // เปลี่ยนสถานะ login ใน global state = true
      } else {
        globalActions.setIsLineLogin(false); // เปลี่ยนสถานะ linelogin ใน global state = false
        globalActions.changeLoginStatus(false); // เปลี่ยนสถานะ login ใน global state = false
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.currentUser]);

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
          {/* {(globalState.loginStatus)&&( */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
          {/* )} */}
          <img src={logo} alt="R8 Anywhere" className={classes.logo} />
          <Typography variant="h6" noWrap>
            <Link to={"/"} className="navbar-brand">R8 Anywhere</Link>
          </Typography>
          
          {(globalState.loginStatus) ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {(!globalState.isLineLogin)?(
                  <AccountCircle />
                ):(
                  <Avatar className={classes.avatarSmall} src={(Object.keys(globalState.currentUser).length!==0)?globalState.currentUser.user.picture:''} />
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
                <Link to={"/profile"}><MenuItem onClick={handleClose}>ข้อมูลส่วนตัว</MenuItem></Link>
                <Link to={"/logOut"}><MenuItem onClick={handleClose}>ออกจากระบบ</MenuItem></Link>
              </Menu>
            </div>
          ):(
            (!mobileView)&&(
              (!globalState.loginStatus) ? (
                <div className="navMenu">
                  <Link to={"/login"}>
                    <Button color="inherit"><LockOpenIcon style={{marginRight:'5px'}}/> Login</Button>
                  </Link>
                  <Link to={"/register"}>
                    <Button color="inherit"><PersonAddIcon style={{marginRight:'5px'}}/> Register</Button>
                  </Link>
                </div>
              ):(
                <div className="navMenu">
                  <Link to={"/logOut"}>
                    <Button color="inherit"><ExitToAppIcon style={{marginRight:'5px'}} /> Logout</Button>
                  </Link>
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
          {(globalState.loginStatus) && (
            sideBarRoute.map( (route, index) =>
              (route.roles.includes(globalState.userRole))&&( // Create Sidebar menu via user role
                <Link key={index} to={route.path} onClick={handleDrawerClose}>
                  <ListItem button key={route.id}>
                    <ListItemIcon>{route.icon}</ListItemIcon>
                    <ListItemText primary={route.id} />
                  </ListItem>
                </Link>
              )
            )
          )}
        </List>
        {(mobileView)&&(<Divider />)}
        {(mobileView)&&(
          (!globalState.loginStatus) ? (
            <List>
              <Link to={"/login"} onClick={handleDrawerClose}>
                <ListItem button key="Login">
                  <ListItemIcon><LockOpenIcon /></ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
              </Link>
              <Link to={"/register"} onClick={handleDrawerClose}>
                <ListItem button key="Register">
                  <ListItemIcon><PersonAddIcon /></ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </Link>
            </List>
          ):(
            <List>
              <Link to={"/logout"}>
                <ListItem button key="Logout">
                  <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
                </Link>
            </List>
          )
          
        )}
      </Drawer>
      <ConfirmProvider>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.toolbar} />
          <Switch>
            {mainRoute.map( (route, index) => 
              (route.roles.includes(globalState.userRole))&&( // Create route by user role
                <Route
                  key={index}
                  exact
                  path={route.path}
                  render={props => (
                    <route.component {...props} />
                  )}
                />
              )
            )}
          </Switch>
        </main>      
      </ConfirmProvider>
    </div >
  );
};

export default App;