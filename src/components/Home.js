import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Button,
} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';

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

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="warning">ประกาศ!<br/>
          ปิดปรับปรุงระบบ ขออภัยในความไม่สะดวกครับ
          </Alert>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;