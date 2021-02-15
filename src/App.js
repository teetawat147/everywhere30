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
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">R8WAY everyWhere30</Link>
        {(logined) ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">{userFullname}</Link>
            </li>
            <li className="nav-item">
              <a href="/logout" className="nav-link" onClick={logOut}>ออกจากระบบ</a>
            </li>
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
      <div className="container mt-3">
        <Switch basename={'/everwhere30'}>
          {(logined) && (
            <Route exact path='/' component={SearchCID} />
          )}
          <Route path='/home' component={Home} />
          <Route path='/register' component={Register} />
          <Route path='/profile' component={Profile} />
          <Route path='/login' render={() => <Login changeLoginStatus={changeLoginStatus} />} />
          <Route path='/linelogin' render={() => <LineLogin changeLoginStatus={changeLoginStatus} />} />
        </Switch>
      </div>
    </div >
  );
};

export default App;
