/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import * as AuthService from "../services/auth.service";
import { makeStyles  } from '@material-ui/core/styles';
import useGlobal from "../store";

const useStyles = makeStyles((theme) => ({

}));

const DialyVisit = () => {
  const [globalState] = useGlobal();
  const classes = useStyles();
  const currentUser = AuthService.getCurrentUser();
  
  return (
    <div className="container">
      <h4>จำนวนผู้รับบริการรายวัน</h4>
      <br/>
    </div>
  );
};

export default DialyVisit;
