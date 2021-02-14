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
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>หมายเลข refer</div>
            <div className={classes.contentText}>{referout.refer_number}</div>
          </div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>โรงพยาบาลปลายทาง</div>
            <div className={classes.contentText}>({referout.refer_hospcode}) {referout.refer_hospital_name}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>pttype</div>
            <div className={classes.contentText}>{referout.pttype} {referout.pttype_name}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>pre_diagnosis</div>
            <div className={classes.contentText}>{referout.pre_diagnosis}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>pdx</div>
            <div className={classes.contentText}>{referout.pdx} {referout.icd_name}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>refer_type</div>
            <div className={classes.contentText}>{referout.refer_type_name}</div>
          </div>
        </div>

        <div>
          <div className={classes.contentGroup}>
            <div className={classes.contentTitle}>refer_cause</div>
            <div className={classes.contentText}>{referout.refer_cause_name}</div>
          </div>
        </div>

      </>
  )
}
