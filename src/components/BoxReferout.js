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

export default function BoxReferout(props) {
  const classes = useStyles();
  const [referout, setReferout] = useState({});

  useEffect(() => {
    console.log(props.data);
    if (props.data) {
      if (Object.keys(props.data).length>0) {
        setReferout(props.data);
      }
    }
  }, [props.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <>
        {/* {mkReferoutList()} */}
        
        <div>
          {/* <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>หมายเลข refer</div>
            <div className={classes.contentText}>{referout.refer_number}</div>
          </div> */}
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>วันที่ส่งต่อ</div>
            <div className={classes.contentText}>{referout.date}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>เวลา</div>
            <div className={classes.contentText}>{referout.time}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>โรงพยาบาลปลายทาง</div>
            <div className={classes.contentText}>({referout.refer_hospcode}) {referout.refer_hospital_name}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>แผนก</div>
            <div className={classes.contentText}>{referout.department}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>จุดส่งต่อ</div>
            <div className={classes.contentText}>{referout.refer_point}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>สิทธิการรักษา</div>
            <div className={classes.contentText}>{referout.pttype_name}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>วินิจฉัย</div>
            <div className={classes.contentText}>({referout.icd10}) {referout.diag_name}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>เหตุผลการส่งต่อ</div>
            <div className={classes.contentText}>{referout.refer_cause_name}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>สาเหตุ</div>
            <div className={classes.contentText}>{referout.rfrcs_name}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>ระดับความฉุกเฉิน</div>
            <div className={classes.contentText}>{referout.referout_emergency_type_name}</div>
          </div>
        </div>

      </>
  )
}
