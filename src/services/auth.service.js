import axios from "axios";
import authHeader from "./auth-header";

const API_URL=authHeader.API_URL;

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "/Users/login?include=User", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.id) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("auth");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getAuthorize = (currentUser) => {
  return axios
    .get(`${API_URL}/Authorizes`, {
      headers: { Authorization: currentUser.id },
      params: {
        filter: {
          where: {
            "userId" : currentUser.userId
          }
        }
      }
    });
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthorize
};
