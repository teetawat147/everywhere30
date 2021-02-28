import React from "react";
import homeImage from "../images/flow_01.jpg";
const Home = () => {

  return (
    <div className="container">
      <header className="jumbotron">
        <img src={homeImage} alt="" style={{ width: '100%' }} />
      </header>
    </div>
  );
};

export default Home;