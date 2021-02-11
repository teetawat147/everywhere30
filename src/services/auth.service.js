import axios from "axios";
import { API_URL } from "../services/auth-header";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};
const login = async (param, res) => {
  try {
    const userinfo = await axios.post(API_URL + "teamusers/login?include=User", param);
    const roleName = await getAuthorize(userinfo.data);
    if (typeof param.picture !== 'undefined') { userinfo.data.user.picture = param.picture; }
    if (typeof roleName !== 'undefined' && roleName !== '') { userinfo.data.user.role = roleName; }
    if (typeof userinfo.data !== 'undefined') { localStorage.setItem("EW30", JSON.stringify(userinfo.data)); }
    return { response: userinfo.data, isLoginError: false };
  } catch (err) {
    return { err, isLoginError: true };
  };
}
const logout = (changeLoginStatus) => {
  localStorage.removeItem("EW30");
  changeLoginStatus(false);
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("EW30"));
};

const getAuthorize = async (userinfo) => {
  let auth = '';
  if (typeof userinfo !== 'undefined') { // กรณี Users มี roleId
    let role = await axios.get(`${API_URL}/Roles`, {
      headers: { Authorization: userinfo.id },
      params: { filter: { where: { "id": userinfo.user.roleId } } }
    });
    auth = role.data[0].name;
  } else { // กรณี Users ไม่มี roleId ใช้ id ไปหาใน RoleMappings, Role
    let roleMapping = await axios.get(`${API_URL}/RoleMappings`, {
      headers: { Authorization: userinfo.id },
      params: { filter: { where: { "principalId": userinfo.user.id } } }
    });
    let roleId = roleMapping.data[0].roleId;
    let role = await axios.get(`${API_URL}/Roles`, {
      headers: { Authorization: userinfo.id },
      params: { filter: { where: { "id": roleId } } }
    });
    auth = role.data[0].name;
  }
  return auth;
};

export {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthorize
};
