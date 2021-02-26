/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import TextField from '@material-ui/core/TextField';
import CheckButton from "react-validation/build/button";
import { login,getPermissions } from "../services/auth.service";
import uuid from 'react-uuid'
import { LineLogin } from '../services/line-login/reactjs-line-login';
import '../services/line-login/reactjs-line-login.css';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core';
import useGlobal from "../store";
const useStyles = makeStyles(theme => ({
  root: {
    '& ._RU-K2': {
      margin: '0',
      width:'100%',
      backgroundSize: 'contain'
    },
    '& .MuiInputLabel-outlined': {
      zIndex: 1,
      transform: 'translate(15px, 4px) scale(1)',
      pointerEvents: 'none'
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(15px, -18px) scale(0.75)',
    }
  }
}));
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
const Login = () => {
  const [globalState, globalActions] = useGlobal();
  const classes = useStyles();
  const redirect = useHistory();
  const form = useRef();
  const checkBtn = useRef();
  const [payload, setPayload] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = async (e, res) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      try {
        let loginData = await login({ email: email, password: password });
        // console.log(loginData);
        if (typeof loginData!=='undefined' && loginData.isLoginError===false) {
          setLoading(false);
          setMessage(loginData.err);
          globalActions.changeLoginStatus(true);
          globalActions.setCurrentUser(loginData.response);
          globalActions.setUserRole(getPermissions());
          redirect.push("/home");
        } else {
          setLoading(false);
          alert("เข้าสู่ระบบไม่สำเร็จ เนื่องจาก\nชื่อผู้ใช้หรือรหัสผ่านผิด\nหรือคุณยังไม่ได้รับการอนุมัติใช้งาน");
          // redirect.push("/login");
        }
      } catch (err) {
        console.log("เข้าสู่ระบบไม่สำเร็จ",err);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" className="profile-img-card" />
        <Form className={classes.root} onSubmit={handleLogin} ref={form}>
          <div className="form-group" style={{marginTop:'40px'}}>
            {/* <label htmlFor="email">Email</label> */}
            <TextField
              id="email"
              name="email"
              label="อีเมลล์"
              type="text"
              size="small"
              variant="outlined"
              value={email}
              onChange={onChangeEmail}
              required
              fullWidth
            />
          </div>
          <div className="form-group" style={{marginTop:'20px'}}>
            {/* <label htmlFor="password">Password</label> */}
            <TextField
              id="password"
              name="password"
              label="รหัสผ่าน"
              type="password"
              size="small"
              variant="outlined"
              value={password}
              onChange={onChangePassword}
              required
              fullWidth
            />
          </div>
          <div className="form-group" style={{marginTop:'40px'}}>
            <button className="btn btn-primary btn-block" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>เข้าสู่ระบบ</span>
            </button>
          </div>
          <div className="form-group">
            <LineLogin
              clientID={process.env.REACT_APP_LINE_CLIENT_ID}
              clientSecret={process.env.REACT_APP_LINE_CLIENT_SECRET}
              redirectURI={process.env.NODE_ENV === 'development' ? process.env.REACT_APP_LINE_REDIRECT_URI_DEV : process.env.REACT_APP_LINE_REDIRECT_URI_PROD}
              state={uuid()}
              prompt=''
              nonce=''
              maxAge={process.env.REACT_APP_LINE_MAX_AGE}
              scope={process.env.REACT_APP_LINE_SCOPE}
              setPayload={setPayload}
              setIdToken={setIdToken}
            />
          </div>
          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">{message}</div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Login;
