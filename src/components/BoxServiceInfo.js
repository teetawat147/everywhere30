import React, { useState, useEffect } from 'react';
import {
  makeStyles
} from '@material-ui/core/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  helperText: {
    color: 'red'
  },
  contentGroup:{
    display: 'inline',
  },
  contentTitle: {
    display: 'inline',
    backgroundColor: '#CDEDFF',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 5
  },
  contentText: {
    display: 'inline',
    marginRight: 10
  },
  linkDateServ: {
    cursor: 'pointer',
    '&:hover': {
      background: "#E5E5E5",
    },
  },
});

export default function BoxServiceInfo(props) {
  const classes = useStyles();
  const [serviceInfo, setServiceInfo] = useState({});
 
  useEffect(() => {
    setServiceInfo(props.data);
  }, [props.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
    <div>
      <div className={classes.contentGroup}>
        <div className={classes.contentTitle}>หน่วยบริการ</div>
        <div className={classes.contentText}>({serviceInfo.hcode}) {serviceInfo.hos_name}</div>
      </div>
      <div className={classes.contentGroup}>
        <div className={classes.contentTitle}>วันที่รับบริการ</div>
        <div className={classes.contentText}>{serviceInfo.date}</div>
      </div>
      <div className={classes.contentGroup}>
        <div className={classes.contentTitle}>เวลารับบริการ</div>
        <div className={classes.contentText}>{serviceInfo.vsttime}</div>
      </div>
    </div>
  </>
  )
}
