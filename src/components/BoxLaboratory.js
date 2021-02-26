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

export default function BoxLaboratory(props) {
  const classes = useStyles();
  const [laboratory, setLaboratory] = useState({});

  const mkLaboratoryList = () => {
    let laboratoryElement=[];
    let labHead=[];
    let labItemGroup=[];
    if (laboratory.length>0) {
      laboratory.forEach(i => {
        if (typeof i.form_name !== 'undefined') {
          if (typeof labHead[i.lab_order_number] === 'undefined') {
            labHead[i.lab_order_number]={lab_order_number:i.lab_order_number, form_name:i.form_name};
          }
        }
        if (typeof labItemGroup[i.lab_order_number] === 'undefined') {
          labItemGroup[i.lab_order_number]=[];
          labItemGroup[i.lab_order_number].push(i);
        }
        else {
          labItemGroup[i.lab_order_number].push(i);
        }
      });

// console.log(labHead);
// console.log(labItemGroup);
      labHead.forEach(i => {
        laboratoryElement.push(
          <div key={'LOB_'+i.lab_order_number} style={{marginBottom: 20}}>
            <div style={{backgroundColor: '#e2e2e2', borderRadius: 10, paddingLeft: 30}}><b>{i.form_name}</b></div>
            <div>
              {mkLabDetail(labItemGroup[i.lab_order_number])}
            </div>
          </div>
        );
      });
    }
    return laboratoryElement;
  }

  const mkLabDetail = (x) => {
    if (typeof x !== 'undefined') {
      let elem=[];
      let n=0;
    // console.log(x);
      x.forEach(i => {
        n++;
        // console.log(i);
        let className=classes.rowCellA;
        if (n%2===0) {
          className=classes.rowCellB;
        }
        elem.push(
          <tr key={i.lab_order_number+'_'+i.lab_items_code+'_'+n}>
            <td style={{width:30}}>{n}</td>
            <td style={{width:'auto'}} className={className}>{i.lab_items_name_ref}</td>
            <td style={{width:'15%'}} className={className}>{i.lab_order_result}</td>
            <td style={{width:'15%'}} className={className}>{i.lab_items_unit}</td>
            <td style={{width:'15%'}} className={className}>{i.lab_items_normal_value_ref}</td>
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
                  <td style={{width:'auto'}} className={classes.rowHead}>ชื่อแลป</td>
                  <td style={{width:'15%'}} className={classes.rowHead}>ผล</td>
                  <td style={{width:'15%'}} className={classes.rowHead}>หน่วย</td>
                  <td style={{width:'15%'}} className={classes.rowHead}>ค่าปกติ</td>
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
    else {
      return null;
    }
  }

  useEffect(() => {
    if (props.data) {
      if (props.data.length>0) {
        setLaboratory(props.data);
        console.log(props.data);
      }
    }
  }, [props.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <>
        {mkLaboratoryList()}
      </>
  )
}
