/* eslint-disable no-unused-vars */
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
  OF_True: {
    height:200, 
    overflowX: 'hidden', 
    overflowY: 'scroll'
  },
  OF_False: {
    height:'auto', 
  },
  rowHead: {
    borderBottom: 'solid 1px #E2E2E2'
  },
});

export default function BoxDiagnosis(props) {
  const classes = useStyles();
  const [diagnosis, setDiagnosis] = useState({});
  const [classOverflow, setClassOverflow] = useState(classes.OF_Ture);

  const mkDiagnosisList = () => {
    let elem=[];
    if (diagnosis.length>0) {
      let n=0;
      diagnosis.forEach(i => {
        n++;
        if (typeof i.icd10 !== 'undefined') {
          elem.push(
            <tr key={'treatment_'+n}>
              <td style={{width:30}}>{n}</td>
              <td style={{width:250}}>{i.diagtype_name}</td>
              <td style={{width:60}}>{i.icd10}</td>
              <td style={{width:'auto'}}>{i.diag_name}</td>
            </tr>
          );
        }
      });
    }

    return (
      <div>
        <div>
          <table style={{width: '100%'}}>
            <thead>
              <tr>
                <td style={{width:30}} className={classes.rowHead}><br /></td>
                <td style={{width:250}} className={classes.rowHead}>ประเภท</td>
                <td style={{width:60}} className={classes.rowHead}>ICD10</td>
                <td style={{width:'auto'}} className={classes.rowHead}>วินิจฉัย</td>
              </tr>
            </thead>
          </table>
        </div>
        {/* <div style={{height:200, overflowX: 'hidden', overflowY: 'scroll' }}> */}
        <div className={classOverflow}>
          <table style={{width: '100%'}}>
            <tbody>
              {elem}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // console.log(props.data);
    if (props.data) {
      if (props.data.length>0) {
        let a=props.data;
        let x = [];
        // eslint-disable-next-line array-callback-return
        a.map(i=>{
          let diag_code=i.icd10;
          if (typeof diag_code === 'undefined') {
            diag_code=i.icd103;
          }
          if (typeof diag_code === 'undefined') {
            diag_code='';
          }
          // console.log(i);
          if (('ABCDEFGHIJKLMNOPQRSTUVWXYZ').indexOf(diag_code.substr(0,1).toUpperCase())>-1) {
            x.push(i);
          }
        });
        x.sort((a, b) => (a.diagtype > b.diagtype) ? 1 : -1);
        setDiagnosis(x);
      }
    }
    if (props.currentView==='summary') {
      setClassOverflow(classes.OF_True);
    }
    else {
      setClassOverflow(classes.OF_False);
    }
  }, [props.data, props.currentView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <>
        {mkDiagnosisList()}
      </>
  )
}
