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

export default function BoxRadiology(props) {
  const classes = useStyles();
  const [radiology, setRadiology] = useState({});

  // const mkRadiologyList = () => {
  //   let radiologyElement=[];
  //   let radiology_n=0;
  //   if (radiology.length>0) {
  //     radiology.forEach(i => {
  //       radiology_n++;
  //       radiologyElement.push(
  //         <div key={'radiology_'+radiology_n}>
  //           รายการที่ {radiology_n} : {i.xray_list}
  //         </div>
  //       );
  //     });
  //   }
  //   return radiologyElement;
  // }


  const mkRadiologyList = () => {
    let elem=[];
    if (radiology.length>0) {
      let n=0;
      radiology.forEach(i => {
        n++;
        // console.log(i);
        elem.push(
          <tr key={'treatment_'+n}>
            <td style={{width:30}}>{n}</td>
            <td style={{width:'auto'}}>{i.xray_list}</td>
          </tr>
        );
      });
    }

    return (
      <div>
        <div>
          <table style={{width: '100%'}}>
            <thead>
              <tr>
                <td style={{width:30}}><br /></td>
                <td style={{width:'auto'}}>รายการ</td>
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
