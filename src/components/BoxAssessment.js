import React, { useState, useEffect } from 'react';
import {
  makeStyles
} from '@material-ui/core/styles';

import ChartDemo from "./ChartDemo";


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

export default function BoxAssessment(props) {
  const classes = useStyles();
  const [assessment, setAssessment] = useState({});
  const [dataAll, setDataAll] = useState({});
 
  useEffect(() => {
    setAssessment(props.data);
    setDataAll(props.dataAll);
  }, [props.data, props.dataAll]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <>
        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>น้ำหนัก</div>
            <div className={classes.contentText}>{assessment.bw}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>ส่วนสูง</div>
            <div className={classes.contentText}>{assessment.height}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>BMI</div>
            <div className={classes.contentText}>{assessment.bmi}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>รอบเอว</div>
            <div className={classes.contentText}>{assessment.waist}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>อุณหภูมิ</div>
            <div className={classes.contentText}>{assessment.temperature}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>BP</div>
            <div className={classes.contentText}>{assessment.bps}/{assessment.bpd}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>pulse</div>
            <div className={classes.contentText}>{assessment.pulse}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>rr</div>
            <div className={classes.contentText}>{assessment.rr}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>Chief Complain</div>
            <div className={classes.contentText}>{assessment.cc}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>HPI</div>
            <div className={classes.contentText}>{assessment.hpi}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>PMH</div>
            <div className={classes.contentText}>{assessment.pmh}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>Symptom</div>
            <div className={classes.contentText}>{assessment.symptom}</div>
          </div>
        </div>

        {/* <ChartDemo /> */}

      </>
  )
}
