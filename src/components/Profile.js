/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import * as AuthService from "../services/auth.service";
const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const [authorizes, setAuthorizes] = useState([]);
  // useEffect(() => {
  //   if (currentUser) {
  //     retrieveAuthorizes();
  //   }
  // }, []);

  // const retrieveAuthorizes = () => {
  //   // setAuthorizes(localStorage.getItem("auth"));
  //   AuthService.getAuthorize(currentUser)
  //     .then(response => {
  //       localStorage.setItem("auth", JSON.stringify(response.data));
  //       // setAuthorizes(response.data);
  //       setAuthorizes(JSON.parse(localStorage.getItem("auth")));
  //       // console.log(response.data);
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Token:</strong> {currentUser.id.substring(0, 20)} ...{" "}
        {currentUser.id.substr(currentUser.id.length - 20)}
      </p>
      <p>
        <strong>Id:</strong> {currentUser.userId}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.user.email}
      </p>
      <strong>Authorities:</strong>
      {authorizes.map((myData, i) => (
        myData.resource_role.map((resource, ii) => (
          <li key={ii}>{resource}</li>
        ))
      ))}
    </div>
  );
};

export default Profile;
