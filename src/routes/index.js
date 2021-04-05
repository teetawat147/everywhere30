/* eslint-disable no-unused-vars */
import React from "react";

// Icons
import HomeIcon from '@material-ui/icons/Home';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import WcIcon from '@material-ui/icons/Wc';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoing';
import GetAppIcon from '@material-ui/icons/GetApp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import DvrIcon from '@material-ui/icons/Dvr';
import SettingsIcon from '@material-ui/icons/Settings';
import SendIcon from '@material-ui/icons/Send';

// Pages Component
import Home from "../components/Home";
import Login from "../components/Login";
import Logout from "../components/Logout";
import LineLogin from "../components/LineLoginCallback";
import Register from "../components/Register";
import Profile from "../components/Profile";
import Consent from "../components/Consent";
import Emr from "../components/SearchCID";
import Referout from "../components/Referout";
import Referin from "../components/Referin";
import UserList from "../components/UserList";
import UserEdit from "../components/UserEdit";
import Monitor from "../components/Monitor";
import SystemSetting from "../components/SystemSetting";
import ClaimSend from "../components/ClaimSend";
import DialyVisit from "../components/DialyVisit";

const root = {
  id: "Root",
  path: "/",
  icon: <HomeIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Claim", "Member", "noRole"],
  component: Home
};
const home = {
  id: "Home",
  path: "/home",
  icon: <HomeIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Claim", "Member", "noRole"],
  component: Home
};
const register = {
  id: "register",
  path: "/register",
  icon: <PersonAddIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Claim", "Member", "noRole"],
  component: Register
};
const linelogin = {
  id: "linelogin",
  path: "/linelogin",
  icon: null,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Claim", "Member", "noRole"],
  component: LineLogin
};
const login = {
  id: "Login",
  path: "/login",
  icon: <LockOpenIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Claim", "Member", "noRole", "Consent"],
  component: Login
};
const logout = {
  id: "Logout",
  path: "/logout",
  icon: <ExitToAppIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Claim", "Member", "noRole", "Consent"],
  component: Logout
};
const emr = {
  id: "EMR",
  path: "/emr",
  icon: <WcIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Claim"],
  component: Emr
};
const referin = {
  id: "Referin",
  path: "/referin",
  icon: <GetAppIcon />,
  // roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Claim"],
  roles: ["AdminR8", "Doctor", "Claim"],
  component: Referin
};
const referout = {
  id: "Referout",
  path: "/referout",
  icon: <CallMissedOutgoingIcon />,
  // roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Claim"],
  roles: ["AdminR8", "Doctor", "Claim"],
  component: Referout
};
const userlist = {
  id: "Users",
  path: "/userlist",
  icon: <SupervisorAccountIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital"],
  component: UserList
};
const useredit = {
  id: "useredit",
  path: "/useredit",
  icon: <SupervisorAccountIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital"],
  component: UserEdit
};
const consent = {
  id: "Consent",
  path: "/consent",
  icon: <AssignmentIcon />,
  roles: ["Doctor", "Consent"],
  component: Consent
};
const profile = {
  id: "Profile",
  path: "/profile",
  icon: null,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Member", "noRole", "Consent"],
  component: Profile
};
const monitor = {
  id: "Monitor",
  path: "/monitor",
  icon: <DvrIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "noRole"],
  component: Monitor
};
const systemsetting = {
  id: "Systemsetting",
  path: "/systemsetting",
  icon: <SettingsIcon />,
  roles: ["AdminR8"],
  component: SystemSetting
};
const claimsend = {
  id: "ClaimSend",
  path: "/claimsend",
  icon: <SendIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "Doctor", "Claim", "Member", "noRole"],
  component: ClaimSend
};
const dialyvisit = {
  id: "Dialyvisit",
  path: "/dialyvisit",
  icon: <DvrIcon />,
  roles: ["AdminR8", "AdminChangwat", "AdminHospital", "noRole"],
  component: DialyVisit
};


export const appBarRoute = [
  root,
  home,
  register,
  login,
  logout
];
export const sideBarRoute = [
  home,
  emr,
  referin,
  referout,
  // claimsend,
  consent,
  monitor,
  userlist,
  systemsetting
];
export const mainRoute = [
  root,
  home,
  register,
  linelogin,
  login,
  logout,
  emr,
  referin,
  referout,
  userlist,
  useredit,
  consent,
  profile,
  monitor,
  systemsetting,
  claimsend,
  dialyvisit
];