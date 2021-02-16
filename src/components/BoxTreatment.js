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
});

export default function BoxTreatment(props) {
  const classes = useStyles();
  const [treatment, setTreatment] = useState({});
  const [typeIO, setTypeIO] = useState('OPD');

  const mkTreatmentList = () => {
    let elem=[];
    if (treatment.length>0) {
      let hasTreatmentDetail=0;
      if (typeof treatment[0] !=='undefined') {
        if (typeof treatment[0].treatmentDetail !=='undefined') {
          hasTreatmentDetail=1;
        }
      }
      if (hasTreatmentDetail===1) {
        // let rxdateData=[];
        // let n=0;
        // // console.log(treatment);
        // treatment.forEach(i=>{
        //   n++;
        //   console.log(i);
        //   rxdateData.push(
        //     <div key={n}>
        //       <div>วันที่ : {i.rxdate} ประเภทใบสั่งยา : {i.order_type}</div>
        //       {typeof i.treatmentDetail !=='undefined' && mkDrugList(i.treatmentDetail)}
        //     </div>
        //   );
        // });
        // return rxdateData;
      }
      else {
        return mkDrugList(treatment);
      }
    }
  }

  const mkDrugList = (x) => {
    let elem=[];
    let n=0;
    x.forEach(i => {
      n++;
      // console.log(i);
      elem.push(
        <tr key={'treatment_'+n}>
          <td style={{width:30}}>{n}</td>
          <td style={{width:'auto'}}>{typeof i.result !== 'undefined'?i.result.icode_name:i.icode_name}</td>
          <td style={{width:'15%'}}>{typeof i.result !== 'undefined'?i.result.qty:i.qty}</td>
        </tr>
      );
    });

    return (
      <div>
        <div>
          <table style={{width: '100%'}}>
            <thead>
              <tr>
                <td style={{width:30}}><br /></td>
                <td style={{width:'auto'}}>รายการ</td>
                <td style={{width:'15%'}}>จำนวน</td>
              </tr>
            </thead>
          </table>
        </div>
        <div style={{height:200, overflowX: 'hidden', overflowY: 'scroll' }}>
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
    if (props.data) {
      if (props.data.length>0) {
        setTreatment(props.data);
        setTypeIO(props.type_io);
      }
    }
  }, [props.data, props.type_io]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <>
        {mkTreatmentList()}
      </>
  )
}
