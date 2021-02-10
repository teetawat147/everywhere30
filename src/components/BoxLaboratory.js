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

export default function BoxLaboratory(props) {
  const classes = useStyles();
  const [laboratory, setLaboratory] = useState({});

  const mkLaboratoryList = () => {
    let laboratoryElement=[];
    let labHead=[];
    let labItemGroup=[];
    if (laboratory.length>0) {

      laboratory.forEach(i => {
        if (typeof i.form_name === 'undefined') {
          if (typeof labItemGroup[i.lab_order_number] === 'undefined') {
            labItemGroup[i.lab_order_number]=[];
            labItemGroup[i.lab_order_number].push(i.laboratoryDetail);
          }
          else {
            labItemGroup[i.lab_order_number].push(i.laboratoryDetail);
          }
        }
        else {
          labHead.push(i);
        }
      });

      labHead.forEach(i => {
        laboratoryElement.push(
          <div key={i.lab_order_number} style={{marginBottom: 20}}>
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
    let elem=[];
    let n=0;
    x[0].forEach(i => {
      n++;
      // console.log(i);
      elem.push(
        <tr key={i.lab_order_number+'_'+i.lab_items_code+'_'+n}>
          <td style={{width:30}}>{n}</td>
          <td style={{width:'auto'}}>{i.lab_items_name_ref}</td>
          <td style={{width:'15%'}}>{i.lab_items_normal_value_ref}</td>
          <td style={{width:'15%'}}>{i.lab_order_result}</td>
          <td style={{width:'15%'}}>{i.lab_items_unit}</td>
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
                <td style={{width:'auto'}}>ชื่อแลป</td>
                <td style={{width:'15%'}}>ค่าปกติ</td>
                <td style={{width:'15%'}}>ผล</td>
                <td style={{width:'15%'}}>หน่วย</td>
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
        setLaboratory(props.data);
      }
    }
  }, [props.data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
      <>
        {mkLaboratoryList()}
      </>
  )
}
