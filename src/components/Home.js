import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Button,
} from "@material-ui/core";
import homeImage from "../images/flow_01.jpg";
import opchat from "../images/opchat.jpg";
import RegisterGuide from "./RegisterGuide";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AppsIcon from '@material-ui/icons/Apps';
import DashboardRegister from './DashboardRegister';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    background: (props) =>
      props.color === 'red'
        ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
        : props.color === 'blue'
        ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
        : props.color === 'green'
        ? 'linear-gradient(45deg, #009900 30%, #00CC66 90%)'
        : props.color === 'orange'
        ? 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)'
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
        : props.color === 'orange'
        ? '0 3px 5px 2px rgba(255, 215, 0, .3)'
        : '',
    color: 'black',
    height: 48,
    padding: '0 30px',
    margin: 8,
    flexGrow: 1,
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
  const history = useHistory();
  const classes = useStyles();
  const [totalPerson, setTotalPerson] = useState(0);
  const [totalIntervention, setTotalIntervention] = useState(0);
  const [totalLog, setTotalLog] = useState(0);
  // const [datenow, setDateNow] = useState(new Date());

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

  const ds = (x) => {
    let y = x.getFullYear().toString();
    let m = az(x.getMonth() + 1, 2);
    let d = az(x.getDate(), 2);
    let ymd = y + '-' + m + '-' + d;
    return ymd;
  }

  const az = (x, n) => {
    let r = x.toString();
    for (var i = 0; i < n - r.length; ++i) {
      r = '0' + r;
    }
    return r;
  }

  const download_consent = () => {
    window.open('https://drive.google.com/file/d/1V1J_oVftGGA7Nm24EzsgqTIv_ncbttFW/view?usp=sharing');
  }

  const goto_link = () => {
    history.push({ pathname: '/DashboardWalkin'});
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <React.Fragment>
            <MyButton color="red">จำนวนผู้ป่วยทั้งหมด &nbsp;&nbsp;<b>{typeof totalPerson.count !== "undefined" ? totalPerson.count.toLocaleString() : totalPerson.count}</b>&nbsp;&nbsp; ราย</MyButton>
            <MyButton color="blue">ประวัติการรักษาทั้งหมด &nbsp;&nbsp;<b>{typeof totalIntervention.count !== "undefined" ? totalIntervention.count.toLocaleString() : totalIntervention.count}</b>&nbsp;&nbsp; รายการ</MyButton>
            <MyButton color="green">ดูประวัติการรักษา &nbsp;&nbsp;<b>{typeof totalLog.count !== "undefined" ? totalLog.count.toLocaleString() : totalLog.count}</b>&nbsp;&nbsp; ครั้ง</MyButton>
            <MyButton color="orange">เข้าใช้งานวันนี้ &nbsp;&nbsp;<b></b>&nbsp;&nbsp; ครั้ง</MyButton>
          </React.Fragment>
        </Grid>
        <Grid item sm={12}>
          <RegisterGuide/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <DashboardRegister/>
        </Grid>
        <Grid item xs={12} sm={3}>
          <img src={opchat} alt="" style={{ width: '100%' }} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <b>Scan</b><br/>
          เข้ากลุ่ม Line<br/>
          เพื่อแจ้งปัญหาการใช้งาน<br/><br/>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<CloudDownloadIcon />}
            onClick={e=>download_consent()}
            >
              Download คู่มือการใช้งาน
          </Button><br/><br/>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<AppsIcon />}
            onClick={e=>goto_link()}
            >
              Dashboard Walkin
          </Button>
        </Grid>
        <Grid item xs={12}>
          
        </Grid>
        <Grid item xs={12}>
          <header className="jumbotron">
            <img src={homeImage} alt="" style={{ width: '100%' }} />
          </header>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;