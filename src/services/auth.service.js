/* eslint-disable no-unused-vars */
import axios from "axios";
import { API_URL } from "../services/auth-header";
const register = (param) => {
  return axios.post(API_URL + "teamusers", param);
};
const login = async (param, res) => {
  let _returnData={};
  try {
    const userinfo = await axios.post(API_URL + "teamusers/login?include=User", param);
    const roleName = await getAuthorize(userinfo.data);
    if (typeof param.picture !== 'undefined') { userinfo.data.user.picture = param.picture; }
    if (typeof roleName !== 'undefined' && roleName !== '') { userinfo.data.user.role = roleName; }
    if (typeof userinfo.data !== 'undefined') { 
      localStorage.setItem("EW30", JSON.stringify(userinfo.data)); 
      _returnData =  { response: userinfo.data, isLoginError: false };
    }else{
      _returnData = { response: userinfo.data, isLoginError: true };
    }
    return _returnData;
  } catch (err) {
    return { err, isLoginError: true };
  };
}
const logout = () => {
  localStorage.removeItem("EW30");
};
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("EW30"));
};
const getAuthorize = async (userinfo) => {
  let auth = '';
  if (typeof userinfo.user !== 'undefined') { 
    if (typeof userinfo.user.roleId !== 'undefined') { // กรณี Users มี roleId
      console.log("Teamuser have roleId");
      let role = await axios.get(`${API_URL}/Roles`, {
        headers: { Authorization: userinfo.id },
        params: { filter: { where: { "id": userinfo.user.roleId } } }
      });
      auth = role.data[0].name;
    } else { // กรณี Users ไม่มี roleId ใช้ id ไปหาใน RoleMappings, Role
      console.log("Teamuser don't have roleId");
      let roleMapping = await axios.get(`${API_URL}/RoleMappings`, {
        headers: { Authorization: userinfo.id },
        params: { filter: { where: { "principalId": userinfo.user.id } } }
      });
      if(typeof roleMapping.data[0]!=='undefined'){
        let roleId = roleMapping.data[0].roleId;
        let role = await axios.get(`${API_URL}/Roles`, {
          headers: { Authorization: userinfo.id },
          params: { filter: { where: { "id": roleId } } }
        });
        console.log("roleMapping : ",roleId);
        console.log("role : ",role.data[0].name);
        auth = role.data[0].name;
      }else{
        auth = 'noRole';
      }
    }
  }else{
    console.log("Don't have userinfo.user ");
  }
  return auth;
};
const getPermissions = () => {
  const userinfo = getCurrentUser();
  if(typeof userinfo !=='undefined' && userinfo != null){
    const role = (typeof userinfo.user.role !== 'undefined') ? userinfo.user.role : 'noRole';
    return role;
  }else{
    return 'noRole';
  }
}
export {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthorize,
  getPermissions
};
