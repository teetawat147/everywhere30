import React, { useEffect } from "react";
import * as AuthService from "../services/auth.service";
import { LINE } from "../services/auth-header";
import axios from "axios";
import qs from 'qs';
import url from 'url';
import jwt from 'jsonwebtoken';
import { useHistory } from "react-router-dom";
const LineLogin = (props) => {
  const redirect = useHistory();
  // const currentUser = AuthService.getCurrentUser();
  // const [authorizes, setAuthorizes] = useState([]);
  // const [isRegist, setIsRegist] = useState(false)
  // const [picture, setPicture] = useState(null);
  // const [listThese, setListThese] = useState([]);
  // const listShow = ['Name', 'Email', 'LineUserID'];
  let params = new URLSearchParams(document.location.search.substring(1));
  let code = params.get("code");

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
      ).then((res) => {
        // console.log('getAccessToken : ', res.data.id_token);
        const decodedIdToken = jwt.verify(res.data.id_token, LINE.client_secret, {
          algorithms: ['HS256'],
          audience: LINE.client_id,
          issuer: 'https://access.line.me',
        });
        console.log("decodedIdToken : ", decodedIdToken);
        AuthService.login({
          email: decodedIdToken.email,
          password: decodedIdToken.sub,
          picture: decodedIdToken.picture
        }).then((response) => {
          console.log("userInfo : ", response.response);
          props.changeLoginStatus(true);
          redirect.push("/");
        }, (error) => {
          console.log("Error : ", error);
        });
      }).catch((error) => {
        console.log("Error : ", error);
      });
    }
  };

  useEffect(() => {
    getAccessToken(window.location.href);
  }, []);

  return (
    <div className="container"></div>
  );
};

export default LineLogin;
