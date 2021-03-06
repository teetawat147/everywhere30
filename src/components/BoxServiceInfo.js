/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { calcAge, thaiXSDate } from "../services/serviceFunction";
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
    // console.log(props.data);
    setServiceInfo(props.data);
  }, [props.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
    <div>
      <div>
        <div className={classes.contentGroup}>
          <div className={classes.contentTitle}>แผนก</div>
          <div className={classes.contentText}>{serviceInfo.type_io}</div>
        </div>
        <div className={classes.contentGroup}>
          <div className={classes.contentTitle}>หน่วยบริการ</div>
          <div className={classes.contentText}>({serviceInfo.hcode}) {serviceInfo.hos_name}</div>
        </div>
        <div className={classes.contentGroup}>
          <div className={classes.contentTitle}>วันที่รับบริการ</div>
          <div className={classes.contentText}>{thaiXSDate(serviceInfo.vstdate)}</div>
        </div>
        {serviceInfo.type_io==='OPD' && (
        <div className={classes.contentGroup}>
          <div className={classes.contentTitle}>เวลารับบริการ</div>
          <div className={classes.contentText}>{serviceInfo.vsttime} น.</div>
        </div>
        )}
      </div>
      {serviceInfo.type_io==='IPD' && (
        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>AN</div>
            <div className={classes.contentText}>{serviceInfo.an}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>วันแอดมิด</div>
            <div className={classes.contentText}>{thaiXSDate(serviceInfo.regdate)}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>วันจำหน่าย</div>
            <div className={classes.contentText}>{thaiXSDate(serviceInfo.dchdate)}</div>
          </div>
        </div>
      )}
    </div>
  </>
  )
}
