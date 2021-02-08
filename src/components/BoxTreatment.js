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

export default function BoxTreatment(props) {
  const classes = useStyles();
  const [treatment, setTreatment] = useState({});

  const mkTreatmentList = () => {
    let treatmentElement=[];
    let treatment_n=0;
    if (treatment.length>0) {
      treatment.forEach(i => {
        treatment_n++;
        treatmentElement.push(
          <div key={'treatment_'+treatment_n}>
            {i.result.icode_name} จำนวน {i.result.qty} ราคา {i.result.sum_price} บาท
          </div>
        );
      });
    }
    return treatmentElement;
  }

  useEffect(() => {
    if (props.data) {
      if (props.data.length>0) {
        setTreatment(props.data);
      }
    }
  }, [props.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <>
        {mkTreatmentList()}
      </>
  )
}
