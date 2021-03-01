/* eslint-disable no-unused-vars */
import React,{useEffect} from "react";
import { useHistory } from "react-router-dom";
import { logout } from "../services/auth.service";
import useGlobal from "../store";

const Logout = () => {
  const [globalState,globalActions] = useGlobal();
  const redirect = useHistory();
  useEffect(() => {
    let logoutStatus=logout();
    if(logoutStatus){
      globalActions.changeLoginStatus(false);
      globalActions.setCurrentUser({});
      globalActions.setUserRole('noRole');
      globalActions.setDrawerOpen(false);
      redirect.push("/login");
    }else{
      console.log(logoutStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return <></>; 
};
export default Logout;
