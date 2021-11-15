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
  },
  OF_True: {
    height:200, 
    overflowX: 'hidden', 
    overflowY: 'scroll'
  },
  OF_False: {
    height:'auto', 
  }
});

export default function BoxTreatment(props) {
  const classes = useStyles();
  const [treatment, setTreatment] = useState({});
  const [classOverflow, setClassOverflow] = useState(classes.OF_Ture);

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
      let drugusage='';
      let du_drugusage_name='';
      let du_shortlist='';
      let du_sp_use_name='';
      if (typeof i.drugusage_name !== 'undefined') {
        if (i.drugusage_name.replace('-','').trim().length>0) {
          du_drugusage_name=i.drugusage_name;
        } 
      }
      if (typeof i.shortlist !== 'undefined') {
        if (i.shortlist.replace('-','').trim().length>0) {
          du_shortlist=i.shortlist;
        } 
      }
      if (typeof i.sp_use_name !== 'undefined') {
        if (i.sp_use_name.replace('-','').trim().length>0) {
          du_sp_use_name=i.sp_use_name;
        } 
      }

      if (du_drugusage_name !== '') {
        drugusage=du_drugusage_name;
      }
      else if (du_shortlist !== '') {
        drugusage=du_shortlist;
      }
      else if (du_sp_use_name !== '') {
        drugusage=du_sp_use_name;
      }
      // console.log(i);
      // console.log('du_drugusage_name:',du_drugusage_name.length+':'+i.drugusage_name+'||--'+i.drugusage_name.replace('-','').trim()+'--');
      // console.log('du_shortlist:',du_shortlist.length+':'+i.shortlist+':');
      // console.log('du_sp_use_name:',du_sp_use_name.length+':'+i.sp_use_name+':');
      let className=classes.rowCellA;
      if (n%2===0) {
        className=classes.rowCellB;
      }
      elem.push(
        <tr key={'treatment_'+n}>
          <td style={{width:30}} className={className}>{n}</td>
          <td style={{width:'auto'}} className={className}>
            {typeof i.drug_name !== 'undefined'?i.drug_name:''} 
            {typeof i.strength !== 'undefined'?(i.strength !==''&&i.strength !==null?'('+i.strength+')':''):''}
            {drugusage && drugusage !== '- -'?(<div style={{color: '#16209d'}}>{drugusage}</div>):''}
            {/* {typeof i.sub_type !== 'undefined'?(parseInt(i.sub_type)===1?(<><br />{drugusage}</>):''):''} */}
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
    if (props.data) {
      if (props.data.length>0) {
        setTreatment(props.data);
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
        {mkTreatmentList()}
      </>
  )
}
