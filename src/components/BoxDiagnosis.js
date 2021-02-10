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

export default function BoxDiagnosis(props) {
  const classes = useStyles();
  const [diagnosis, setDiagnosis] = useState({});

  const mkDiagnosisList = () => {
    let diagnosisElement=[];
    let diagnosis_n=0;
    if (diagnosis.length>0) {
      diagnosis.forEach(i => {
        diagnosis_n++;
        diagnosisElement.push(
          <div key={'diagnosis_'+diagnosis_n}>
            {/* ({i.diagtype}){i.diagtype_name} : {i.icd103}  */}
            ({i.diagtype}){i.diagtype_name} : {i.icd10_name} 
          </div>
        );
      });
    }
    return diagnosisElement;
  }

  useEffect(() => {
    if (props.data) {
      if (props.data.length>0) {
        setDiagnosis(props.data);
      }
    }
  }, [props.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <>
        {mkDiagnosisList()}
      </>
  )
}
