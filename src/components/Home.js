import React, { useState, useEffect } from "react";
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Button,
} from "@material-ui/core";
import homeImage from "../images/flow_01.jpg";
import RegisterGuide from "./RegisterGuide";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DashboardRegister from './DashboardRegister';

const useStyles = makeStyles((theme) => ({
  root: {
    background: (props) =>
      props.color === 'red'
        ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        : props.color === 'blue'
        ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
        : props.color === 'green'
        ? 'linear-gradient(45deg, #009900 30%, #00CC66 90%)'
        : '',
    border: 0,
    borderRadius: 3,
    boxShadow: (props) =>
      props.color === 'red'
        ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
        : props.color === 'blue'
        ? '0 3px 5px 2px rgba(33, 203, 243, .3)'
        : props.color === 'green'
        ? '0 3px 5px 2px rgba(0, 255, 127, .3)'
        : '',
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
  color: PropTypes.oneOf(['blue', 'red', 'green']).isRequired,
};

const Home = () => {
  const classes = useStyles();
  const [totalPerson, setTotalPerson] = useState(0);
  const [totalIntervention, setTotalIntervention] = useState(0);
  const [totalLog, setTotalLog] = useState(0);

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
  }, []);

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
  }, []);

  useEffect(() => {
    const getCountLog = async () => {
      let response = await axios.get(process.env.REACT_APP_API_URL + "logs/count", {
        // params: {
        //   where: {
        //     "date": "2021-02-28"
        //   }
        // }
      });
      if (response.status === 200) {
        if (response.data) {
          setTotalLog(response.data);
        }
      }
    }
    getCountLog();
  }, []);

  const download_consent = () => {
    window.open('https://drive.google.com/file/d/1V1J_oVftGGA7Nm24EzsgqTIv_ncbttFW/view?usp=sharing');
  }

  return (
    <div className="container">
      <React.Fragment>
        <MyButton color="red">จำนวนผู้ป่วยทั้งหมด &nbsp;&nbsp;<b>{typeof totalPerson.count !== "undefined" ? totalPerson.count.toLocaleString() : totalPerson.count}</b>&nbsp;&nbsp; ราย</MyButton>
        <MyButton color="blue">ประวัติการรักษาทั้งหมด &nbsp;&nbsp;<b>{typeof totalIntervention.count !== "undefined" ? totalIntervention.count.toLocaleString() : totalIntervention.count}</b>&nbsp;&nbsp; รายการ</MyButton>
        <MyButton color="green">ดูประวัติการรักษา &nbsp;&nbsp;<b>{typeof totalLog.count !== "undefined" ? totalLog.count.toLocaleString() : totalLog.count}</b>&nbsp;&nbsp; ครั้ง</MyButton>
      </React.Fragment>
      <br/><br/>
      <RegisterGuide/>
      <br/>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        startIcon={<CloudDownloadIcon />}
        onClick={e=>download_consent()}
      >
        Download คู่มือการใช้งาน
      </Button>
      <br/><br/>
      <DashboardRegister/>
      <br/>
      <header className="jumbotron">
        <img src={homeImage} alt="" style={{ width: '100%' }} />
      </header>
      
    </div>
  );
};

export default Home;