import React from "react";
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { sideBarRoute } from '../routes/index';
import useGlobal from "../store";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
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
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }
}));
const Sidebar = () => {
  const [globalState, globalActions] = useGlobal();
  const classes = useStyles();
  const theme = useTheme();
  const handleDrawerClose = () => { globalActions.setDrawerOpen(false) };
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={globalState.drawerOpen}
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
      {(globalState.loginStatus) ? ( // Login แล้ว
        <List>
          {sideBarRoute.map((route, index) =>
            (route.roles.includes(globalState.userRole)) && ( // Create Sidebar menu via user role
              <Link key={index} to={route.path} onClick={handleDrawerClose}>
                <ListItem button key={route.id}>
                  <ListItemIcon>{route.icon}</ListItemIcon>
                  <ListItemText primary={route.id} />
                </ListItem>
              </Link>
            )
          )}
          <Divider />
          {(globalState.mobileView) && (  // แสดงเฉพาะ Mobile          
            <Link to={"/logout"}>
              <ListItem button key="Logout">
                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </Link>
          )}
        </List>
      ) : ( // ยังไม่ Login
          (globalState.mobileView) && ( // แสดงเฉพาะ Mobile
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
          )
        )}

    </Drawer>
  )
};
export default Sidebar;