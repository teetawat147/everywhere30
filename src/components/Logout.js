/* eslint-disable no-unused-vars */
import React,{useEffect} from "react";
import { useHistory } from "react-router-dom";
import { logout } from "../services/auth.service";
import useGlobal from "../store";

const Logout = () => {
  const [globalState,globalActions] = useGlobal();
  const redirect = useHistory();
  useEffect(() => {
    logout();
    globalActions.changeLoginStatus(false);
    globalActions.setCurrentUser({});
    globalActions.setUserRole('noRole');
    redirect.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return <></>; 
};
export default Logout;
