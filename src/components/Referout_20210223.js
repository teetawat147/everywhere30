/* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from 'react';
import {
  makeStyles
} from '@material-ui/core/styles';
// npm install use-mediaquery --save

import useMediaQuery from '@material-ui/core/useMediaQuery';

// import UDataTable from "./UniversalDataTable";
// import UCard from "./UniversalCard";
// import UListTable from "./UniversalListTable";

import UAPI from "../services/UniversalAPI";
import { calcAge, thaiXSDate } from "../services/serviceFunction";
import BoxServiceInfo from "./BoxServiceInfo";
import BoxAssessment from "./BoxAssessment";
import BoxDiagnosis from "./BoxDiagnosis";
import BoxTreatment from "./BoxTreatment";
import BoxLaboratory from "./BoxLaboratory";
import BoxRadiology from "./BoxRadiology";
import BoxReferout from "./BoxReferout";

import {
  // InputAdornment,
  // OutlinedInput,
  Button,
  TextField,
  // AppBar,
  Tabs,
  Tab,
  Paper,
  Box,
  Tooltip, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  Grid,
} from '@material-ui/core';

import PropTypes from 'prop-types';

import { MdSearch, MdSwapHoriz, MdSwapVert } from 'react-icons/md';

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
      background: "#cdf1ff",
    },
  },
});

export default function SearchCID(props) {
  const classes = useStyles();
  const [data, setData] = useState(null);

  const getData = async () => {
    // let xParams = {
    //   filter: {
    //     where: {cid:'3470200241827'},
    //     include: {
    //       relation: "intervention",
    //       scope: {
    //         include: {
    //           relation: "hospital",
    //         }
    //       }
    //     }
    //   }
    // };
    
    // let xParams = {
    //   filter: {
    //     limit: 10,
    //     include: {
    //       relation: "intervention",
    //       scope: {
    //         where: {
    //           rfrolct:{
    //             gt:''
    //           }
    //         },
    //         include: {
    //           relation: "hospital",
    //         }
    //       }
    //     }
    //   }
    // };
  
    // let response = await UAPI.getAll(xParams, 'people');
    // if (response.status === 200) {
    //   if (response.data) {
    //     if (response.data.length>0) {
    //       console.log(response.data);
    //       // let r=response.data[0];
    //       // console.log(r);
    //     }
    //   }
    // }

    let xParams = {
      filter: {
        where:{
          rfrolct:{gt:"0"}
        },
        limit:10
      }
    };

    let response = await UAPI.getAll(xParams, 'interventions');
    let d=[];
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length>0) {
          d=response.data;
        }
      }
    }

    for (let index = 0; index < d.length; index++) {
      const i = d[index];
      let x = await UAPI.getAll({filter:{where:{id:i.personId}}}, 'people');
      d[index]['person']=x.data[0];
    }

    setData(d);
    // console.log(d);

  }

  const mkRows = () => {
    let r=[];
    if (data) {
      if (typeof data !== 'undefined') {
        if (data.length>0) {
          data.forEach(i => {
            console.log(i.rfrolct);
            console.log(i.activities);
            // วันที่ส่งตัว วันที่รับตัว เลขที่ใบส่งตัว รพ.ปลายทาง HN ชื่อสกุล CID สิทธิ การวินิจฉัย จุดส่งต่อ แผนก ประเภทการส่งต่อ วันหมดอายุ เรียกเก็บไปที่ จนท.อนุมัติสิทธิ approve หมายเหตุ
            r.push(
              <Grid container key={i.id}>
                <Grid item xs={12} sm={6}>
                  {i.person.fname} {i.person.lname}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {i.person.fname} {i.person.lname}
                </Grid>
              </Grid>
              // <Grid container>
              //   <Grid item xs={6}>
              //       <MyElement 
              //         contentLeft="Something displayed in the left"
              //         contentRight="Something displayed in the right"
              //       >
              //   </Grid>
              //   <Grid item xs={6}>
              //     <MyElement 
              //         contentLeft="Something displayed in the left"
              //         contentRight="Something displayed in the right"
              //     >
              //   </Grid>
              // </Grid>
            );
          });
        }
      }
    }
    return r;
  }

  useEffect(() => {
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   extractServiceInfo();
  // }, [serviceData]); // eslint-disable-line react-hooks/exhaustive-deps
  
  
  return (
    <div style={{marginBottom:100}}>

      <div><h5>REFEROUT</h5></div>
      <div>กรองวันที่</div>
      <div>
        {mkRows()}
      </div>

    </div>
  )
}
