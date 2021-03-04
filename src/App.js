/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Route, Switch } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { getCurrentUser, getPermissions } from "./services/auth.service";
import { ConfirmProvider } from 'material-ui-confirm';
import DialogProvider from "./services/dialog/DialogProvider.tsx";
import { mainRoute } from './routes/index';
import useGlobal from "./store";
import Appbar from './layout/Appbar';
import Sidebar from './layout/Sidebar';
import { useIdleTimer } from 'react-idle-timer';
import { useHistory } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    "& .MuiToolbar-root h6": { width: '100%' },
    "& .navMenu": {
      position: 'absolute',
      right: '24px'
    },
    "& .MuiAppBar-colorSecondary": {
      color: "#fff",
      backgroundColor: "#2e2e37"
    },
    "& a.navbar-brand, .navMenu a": { color: '#fdfeff', textDecoration: 'none' },
    "& a.navbar-brand:hover, .navMenu a:hover": { color: '#e0e0e0', textDecoration: 'none' },
    "& .MuiDrawer-root a": { color: 'rgba(0, 0, 0, 0.87)', textDecoration: 'none' },
    "& .MuiDrawer-root a:hover": { color: 'rgba(0, 0, 0, 0.87)', textDecoration: 'none' },
    // "& .MuiButton-root:hover":{backgroundColor:'#ffffff0f'},
    "& .MuiButton-root": { marginLeft: '5px' }
  },
  popupMenuLink: {
    "& a": { color: 'rgba(0, 0, 0, 0.87)', textDecoration: 'none' },
    "& a:hover": { textDecoration: 'none' }
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
  const classes = useStyles();
  const redirect = useHistory();
  const handleOnIdle = () => { if (globalState.loginStatus) { redirect.push("/logout") } }
  const { reset, pause, resume } = useIdleTimer({
    timeout: 1000 * 60 * process.env.REACT_APP_USER_IDLE_TIMEOUT,
    stopOnIdle: true,
    startOnMount: false,
    eventsThrottle: 1000,
    onIdle: handleOnIdle,
    debounce: 500
  });

  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));
    globalActions.setMobileView(mobile);
    // console.log('globalstate : ', globalState);
    if (globalState.currentUser != null) {
      // console.log(Object.keys(globalState.currentUser).length);
      if (Object.keys(globalState.currentUser).length === 0) {
        // กรณี refresh หน้าเว็บให้ไป get localstorage มาใส่ใน global state
        let CU = getCurrentUser();
        globalActions.setCurrentUser((CU != null) ? CU : {});
      }
      if (globalState.userRole === 'noRole') {
        // กรณี refresh หน้าเว็บให้ไป get localstorage มาใส่ใน global state
        let UR = getPermissions();
        globalActions.setUserRole(UR);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // ถ้า login ให้เริ่มการทำงานเฝ้าดูการทำงานของ user idle timeout
    if (globalState.loginStatus) {
      // console.log('start timer');
      resume();
      reset();
    } else {
      // console.log('stop timer');
      pause();
    }
    if (globalState.currentUser != null) {
      if (Object.keys(globalState.currentUser).length !== 0) { // ถ้ามีข้อมูล user ใน global state
        if (globalState.currentUser.user.picture !== null && typeof globalState.currentUser.user.picture !== 'undefined') { // ถ้ามีรูปภาพ line profile
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
      <Appbar />
      <Sidebar />
      <DialogProvider>
        <ConfirmProvider>
          <main className={clsx(classes.content, { [classes.contentShift]: globalState.drawerOpen, })}>
            <div className={classes.toolbar} />
            <Switch>
              {mainRoute.map((route, index) =>
                (route.roles.includes(globalState.userRole)) && (
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
      </DialogProvider>
    </div >
  );
};

export default App;