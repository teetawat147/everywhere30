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
  rowHead: {
    borderBottom: 'solid 1px #E2E2E2'
  },
  rowCellA: {
  },
  rowCellB: {
    backgroundColor: '#f3f3f3',
  }
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

    x.sort(function(a,b){
      // b-a เรียงมากไปน้อย
      // a-b เรียงน้อยไปมาก
      return a.sub_type-b.sub_type;
    });

    x.forEach(i => {
      n++;
      // console.log(i);
      let className=classes.rowCellA;
      if (n%2===0) {
        className=classes.rowCellB;
      }
      let drugusage_name=null;
      if (typeof i.drugusage_name !== 'undefined') {
        if (i.drugusage_name!==null&&i.drugusage_name!=='') {
          drugusage_name=i.drugusage_name; 
        }
      }
      elem.push(
        <tr key={'treatment_'+n}>
          <td style={{width:30}} className={className}>{n}</td>
          <td style={{width:'auto'}} className={className}>
            {typeof i.drug_name !== 'undefined'?i.drug_name:''}
            {drugusage_name?<br />:''}
            {drugusage_name?drugusage_name:''}
          </td>
          <td style={{width:'15%'}} className={className}>{typeof i.qty !== 'undefined'?i.qty:''} {typeof i.units !== 'undefined'?i.units:''}</td>
        </tr>
      );
    });

    return (
      <div>
        <div>
          <table style={{width: '100%'}}>
            <thead>
              <tr>
                <td style={{width:30}} className={classes.rowHead}><br /></td>
                <td style={{width:'auto'}} className={classes.rowHead}>รายการ</td>
                <td style={{width:'15%'}} className={classes.rowHead}>จำนวน</td>
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
