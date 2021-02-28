import React from "react";
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles  } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import logo from "../images/logo192.png";
import useGlobal from "../store";

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
  hide: { display: 'none' },
  toolbar: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(),
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  avatarSmall: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));
const Appbar = () => {
  const [globalState, globalActions] = useGlobal();
  const classes = useStyles();
  const handleDrawerOpen = () => {globalActions.setDrawerOpen(true)};
  const handleMenu = (event) => {globalActions.setAnchorEl(event.currentTarget)};
  const handleClose = () => {globalActions.setAnchorEl(null)};
  const openMenu = Boolean(globalState.anchorEl);
  return (
    <AppBar 
      position="fixed" 
      color="secondary" 
      className={clsx(classes.appBar, {
        [classes.appBarShift]: globalState.drawerOpen,
      })}
    >
      <Toolbar>
        {
          (globalState.mobileView)?(
            <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, globalState.drawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          ):(
            (globalState.loginStatus)&&(
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, globalState.drawerOpen && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
            )
          )
        } 
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
              anchorEl={globalState.anchorEl}
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
              <Link to={"/profile"}><MenuItem onClick={handleClose}>Profile</MenuItem></Link>
              <Link to={"/logOut"}><MenuItem onClick={handleClose}>Logout</MenuItem></Link>
            </Menu>
          </div>
        ):(
          (!globalState.mobileView)&&(
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
  )
};
export default  Appbar;