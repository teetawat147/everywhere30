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

export default function BoxRadiology(props) {
  const classes = useStyles();
  const [radiology, setRadiology] = useState({});

  const mkRadiologyList = () => {
    let radiologyElement=[];
    let radiology_n=0;
    if (radiology.length>0) {
      radiology.forEach(i => {
        radiology_n++;
        radiologyElement.push(
          <div key={'radiology_'+radiology_n}>
            {i.result.icode_name} จำนวน {i.result.qty} ราคา {i.result.sum_price} บาท
          </div>
        );
      });
    }
    return radiologyElement;
  }

  useEffect(() => {
    if (props.data) {
      if (props.data.length>0) {
        setRadiology(props.data);
      }
    }
  }, [props.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <>
        {mkRadiologyList()}
      </>
  )
}
