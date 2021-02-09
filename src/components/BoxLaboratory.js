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

  // const mkLaboratoryList = () => {
  //   let laboratoryElement=[];
  //   let laboratory_n=0;
  //   if (laboratory.length>0) {
  //     laboratory.forEach(i => {
  //       console.log(i);
  //       laboratory_n++;
  //       laboratoryElement.push(
  //         <div key={'laboratory_'+laboratory_n}>
  //           {/* {i.result.icode_name} จำนวน {i.result.qty} ราคา {i.result.sum_price} บาท */}
  //         </div>
  //       );
  //     });
  //   }
  //   return laboratoryElement;
  // }

  const mkLaboratoryList = () => {
    let labHead=[];
    let labItemGroup=[];
    if (laboratory.length>0) {

      laboratory.forEach(i => {
        // console.log(i.form_name);
        if (typeof i.form_name === 'undefined') {
          if (typeof labItemGroup[i.lab_order_number] === 'undefined') {
            // labHead.push(i);
            labItemGroup[i.lab_order_number]=[];
            labItemGroup[i.lab_order_number].push(i.laboratoryDetail);
          }
          else {
            labItemGroup[i.lab_order_number].push(i.laboratoryDetail);
          }
        }
      });

      laboratory.forEach(i => {
        // console.log(i.form_name);
        if (typeof i.form_name != 'undefined') {
          labHead.push(i);
        }
      });

    }
    console.log(labItemGroup);
    console.log(labHead);
    // return laboratoryElement;
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
