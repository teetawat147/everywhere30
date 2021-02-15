import React, { useState, useEffect,useRef } from "react";
import {login} from "../services/auth.service";
import { LINE } from "../services/auth-header";
import axios from "axios";
import qs from 'qs';
import url from 'url';
import jwt from 'jsonwebtoken';
import { useHistory } from "react-router-dom";
import Register from "./Register";
const LineLogin = (props) => {
  const redirect = useHistory();
  // const currentUser = AuthService.getCurrentUser();
  const [loginStatus, setLoginStatus] = useState(false);
  const isMountedRef = useRef(null);
  // const [isRegist, setIsRegist] = useState(false)
  // const [picture, setPicture] = useState(null);
  // const [listThese, setListThese] = useState([]);
  // const listShow = ['Name', 'Email', 'LineUserID'];
  let params = new URLSearchParams(document.location.search.substring(1));
  let code = params.get("code");
  const [{ fullname, email, password, picture }, setLineInfo] = useState({ fullname: '', email: '', password: '', picture: '' });
  const getAccessToken = (callbackURL) => {
    var urlParts = url.parse(callbackURL, true);
    var query = urlParts.query;
    var hasCodeProperty = Object.prototype.hasOwnProperty.call(query, 'code');
    if (hasCodeProperty) {
      const reqBody = {
        grant_type: 'authorization_code',
        code: code,
        client_id: LINE.client_id,
        client_secret: LINE.client_secret,
        redirect_uri: LINE.redirect_uri
      };
      const reqConfig = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      };
      axios.post(
        LINE.api + 'token', qs.stringify(reqBody), reqConfig
      ).then(async(res) => {
        // console.log('getAccessToken : ', res.data.id_token);
        const decodedIdToken = jwt.verify(res.data.id_token, LINE.client_secret, {
          algorithms: ['HS256'],
          audience: LINE.client_id,
          issuer: 'https://access.line.me',
        });
        // console.log("decodedIdToken : ", decodedIdToken);
        await login({
          email: decodedIdToken.email,
          password: decodedIdToken.sub,
          picture: decodedIdToken.picture
        }).then((response) => {
          
          if(!response.isLoginError){
            // Login success then go to root page
            console.log("userInfo : ", response.response);
            setLoginStatus(true);
            props.changeLoginStatus(true);
            redirect.push("/");
          }else{
            // Set info for register page
            console.log("Unauthorized need to register first.");
            isMountedRef.current=true;
            setLineInfo({
              fullname: decodedIdToken.name,
              email: decodedIdToken.email,
              password: decodedIdToken.sub,
              picture: decodedIdToken.picture
            });
          }
        }, (error) => {
          console.log("Error : ", error);
        });
      }).catch((error) => {
        console.log("Error : ", error);
      });
    }
  };

  useEffect(() => {
    isMountedRef.current=false;
    getAccessToken(window.location.href);
    return () => isMountedRef.current = true;
  }, []);
  // useEffect(()=>{
    
  // },[loginStatus])

  return (
    <div className="container">
      { (isMountedRef.current) ? (
          <Register lineInfo={{fullname: fullname,email: email,password: password,picture: picture}} />
        ):('')
      }
    </div>
  );
};

export default LineLogin;
