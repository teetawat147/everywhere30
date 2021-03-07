import React, { useState, useEffect } from "react";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Button,
} from "@material-ui/core";
import homeImage from "../images/flow_01.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    background: (props) =>
      props.color === 'red'
        ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: (props) =>
      props.color === 'red'
        ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
        : '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: 8,
  }
}));

function MyButton(props) {
  const { color, ...other } = props;
  const classes = useStyles(props);
  return <Button className={classes.root} {...other} />;
}

MyButton.propTypes = {
  color: PropTypes.oneOf(['blue', 'red']).isRequired,
};

const Home = () => {
  const [totalPerson, setTotalPerson] = useState(0);
  const [totalIntervention, setTotalIntervention] = useState(0);

  useEffect(() => {
    const getCountPerson = async () => {
      let response = await axios.get(process.env.REACT_APP_API_URL + "people/count");
      if (response.status === 200) {
        if (response.data) {
          setTotalPerson(response.data);
        }
      }
    }
    getCountPerson();
  }, [totalPerson]);

  useEffect(() => {
    const getCountIntervention = async () => {
      let response = await axios.get(process.env.REACT_APP_API_URL + "interventions/count");
      if (response.status === 200) {
        if (response.data) {
          setTotalIntervention(response.data);
        }
      }
    }
    getCountIntervention();
  }, [totalIntervention]);

  return (
    <div className="container">
      <React.Fragment>
        <MyButton color="red">จำนวนผู้ป่วยทั้งหมด &nbsp;&nbsp;<b>{typeof totalPerson.count !== "undefined" ? totalPerson.count.toLocaleString() : totalPerson.count}</b>&nbsp;&nbsp; ราย</MyButton>
        <MyButton color="blue">ประวัติการรักษาทั้งหมด &nbsp;&nbsp;<b>{typeof totalIntervention.count !== "undefined" ? totalIntervention.count.toLocaleString() : totalIntervention.count}</b>&nbsp;&nbsp; รายการ</MyButton>
      </React.Fragment>
      <br/><br/>
      <header className="jumbotron">
        <img src={homeImage} alt="" style={{ width: '100%' }} />
      </header>
    </div>
  );
};

export default Home;