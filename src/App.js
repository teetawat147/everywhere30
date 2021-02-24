import React, { useState, useEffect } from "react";
import {
  Route,
  useHistory,
  Link,
  Switch
} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { getCurrentUser, logout } from "./services/auth.service";
import Login from "./components/Login";
import LineLogin from "./components/LineLoginCallback";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Emr from "./components/SearchCID";
import Referout from "./components/Referout";
import Referin from "./components/Referin";
import UserList from "./components/UserList";
import UserEdit from "./components/UserEdit";

// import BoardUser from "./components/BoardUser";
// import BoardModerator from "./components/BoardModerator";
// import BoardAdmin from "./components/BoardAdmin";
// import Universal from "./components/Universal";
import SearchCID from "./components/SearchCID";
const App = () => {
  const redirect = useHistory();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [logined, setLogined] = useState(false);
  const [userFullname, setUserFullname] = useState('');

  useEffect(() => {
    if (currentUser !== null) {
      if (currentUser.user.fullname !== null && typeof currentUser.user.fullname !== 'undefined') {
        setUserFullname(currentUser.user.fullname);
      }
      setLogined(true);
    } else {
      setLogined(false);
      setCurrentUser(getCurrentUser());
    }
  }, [currentUser]);
  const changeLoginStatus = (status) => {
    setLogined(status);
    setCurrentUser(getCurrentUser());
    if (status === false) {
      redirect.push("/login");
    }
  }
  const logOut = (e) => {
    e.preventDefault();
    logout(changeLoginStatus);
  };

  return (
    // <div style={{border: 'solid 1px blue'}}>
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">R8 | Anywhere</Link>
        {(logined) ? (
          <div style={{ width: '100%' ,display:'flex' ,justifyContent:'space-between' }}>

            <div className="navbar-nav">
              <li className="nav-item">
                <Link to={"/emr"} className="nav-link">EMR</Link>
              </li>
              <li className="nav-item">
                <Link to={"/referout"} className="nav-link">ReferOut</Link>
              </li>
              <li className="nav-item">
                <Link to={"/referin"} className="nav-link">ReferIn</Link>
              </li>
            </div>

            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">{userFullname}</Link>
              </li>
              <li className="nav-item">
                <a href="/logout" className="nav-link" onClick={logOut}>ออกจากระบบ</a>
              </li>
            </div>

          </div>
        ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">เข้าสู่ระบบ</Link>
              </li>
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">ลงทะเบียน</Link>
              </li>
            </div>
          )}
      </nav>
      <div style={{ width: 'auto', margin: 10,}}>
        <Switch>
          {/* {(logined) && (
            <Route exact path='/' component={Home} />
          )} */}
          <Route exact path='/' component={Home} />
          <Route path='/home' component={Home} />
          <Route path='/register' component={Register} />
          <Route path='/profile' component={Profile} />
          <Route path='/login' render={() => <Login changeLoginStatus={changeLoginStatus} />} />
          <Route path='/linelogin' render={() => <LineLogin changeLoginStatus={changeLoginStatus} />} />
          <Route path='/emr' component={Emr} />
          <Route path='/referout' component={Referout} />
          <Route path='/referin' component={Referin} />
          <Route path='/userlist' component={UserList} />
          <Route path='/useredit' component={UserEdit} />
        </Switch>
      </div>
    </div >
  );
};

export default App;
