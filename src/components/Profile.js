/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import * as AuthService from "../services/auth.service";
import { makeStyles  } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import useGlobal from "../store";
import logo from "../images/logo192.png";

const useStyles = makeStyles((theme) => ({
  hide: { display: 'none' },
  avatarLarge: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const Profile = () => {
  const [globalState] = useGlobal();
  const classes = useStyles();
  const currentUser = AuthService.getCurrentUser();
  
  return (
    <div className="container">
      <h4>Profile</h4>
      <br/>
      {(!globalState.isLineLogin)?(
        <Avatar className={classes.avatarLarge} src={logo} />
      ):(
        <Avatar className={classes.avatarLarge} src={(Object.keys(globalState.currentUser).length!==0)?globalState.currentUser.user.picture: ''} />
      )}<br/>
      <p><strong>ID :</strong> {currentUser.userId}</p>
      <p><strong>ชื่อ - สกุล :</strong> {currentUser.user.fullname}</p>
      <p><strong>ตำแหน่ง :</strong> {currentUser.user.position}</p>
      <p><strong>เบอร์โทร :</strong> {currentUser.user.mobile}</p>
      <p><strong>Email :</strong> {currentUser.user.email}</p>
      <p><strong>Role : </strong> {currentUser.user.role}</p>
    </div>
  );
};

export default Profile;
