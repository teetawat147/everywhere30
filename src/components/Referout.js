/* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'

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
  IconButton,
} from '@material-ui/core';

import PropTypes from 'prop-types';

import { MdSearch, MdRemoveRedEye } from 'react-icons/md';

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
  thead: {
    whiteSpace: 'nowrap',
    borderBottom: 'solid 1px #dadada',
    padding: 5,
    backgroundColor: '#E3E3E3'
  },
  tcell: {
    whiteSpace: 'nowrap',
    borderBottom: 'solid 1px #dadada',
    paddingRight: 3
  }
});

export default function SearchCID(props) {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState(null);

  const getData = async () => {
    let xParams = {
      filter: {
        where: {cid:{inq:['1471400120432','1479900187312','3470200241827']}},
        include: {
          relation: "intervention",
          scope: {
            include: {
              relation: "hospital",
            }
          }
        }
      }
    };
  
    let response = await UAPI.getAll(xParams, 'people');
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length>0) {
          // console.log(response.data);
          // let r=response.data[0];
          // console.log(r);
          setData(response.data);
        }
      }
    }

  }

  const clickRow = (e,d,hcode,vn,cid) => {
    // console.log(d,hcode,vn,cid);
    history.push({ pathname: '/emr', state: {date: d, hcode: hcode,vn: vn, cid: cid} });
  }

  const mkRows = () => {
    let r=[];
    if (data) {
      if (typeof data !== 'undefined') {
        if (data.length>0) {
          data.forEach(i => {
            let refer;
            let vn='';
            let visit_date;
            i.intervention.forEach(a => {
              if (typeof a.activities.referout !== 'undefined') {
                if (a.activities.referout.length>0) {
                  // console.log(a);
                  refer=a.activities.referout[0];
                  vn=a.vn;
                  visit_date=(typeof a.vstdate !== 'undefined'? a.vstdate : '');
                }
              }
            });
            // console.log(refer);
            r.push(
              <tr key={i.id}>
                <td className={classes.tcell} style={{paddingLeft: 10, paddingRight: 10}}>
                  <IconButton key="btnEdit" variant="outlined" color="primary" onClick={(e)=>clickRow(e,visit_date,i.hcode,vn,i.cid)}>
                    <MdRemoveRedEye size={20} />
                  </IconButton>
                </td>
                <td className={classes.tcell}>{typeof refer.refer_date !=='undefined'?refer.refer_date:refer.date}</td>
                <td className={classes.tcell}></td>
                <td className={classes.tcell}>{typeof refer.refer_number !== 'undefined'?refer.refer_number:''}</td>
                <td className={classes.tcell}>
                  {typeof refer.refer_hospcode !== 'undefined'?refer.refer_hospcode:''} {typeof refer.refer_hospital_name !== 'undefined'?refer.refer_hospital_name:''}
                </td>
                <td className={classes.tcell}>{i.hn}</td>
                <td className={classes.tcell}>{i.fname} {i.lname}</td>
                <td className={classes.tcell}>{i.cid}</td>
                <td className={classes.tcell}>{i.hcode}</td>
                <td className={classes.tcell}>{typeof refer.pttype_name !== 'undefined'?refer.pttype_name:''}</td>
                <td className={classes.tcell}>{typeof refer.depcode !== 'undefined'?refer.depcode:''}</td>
                <td className={classes.tcell}>{typeof refer.department !== 'undefined'?refer.department:''}</td>
                <td className={classes.tcell}>{typeof refer.refer_type_name !== 'undefined'?refer.refer_type_name:''}</td>
                <td className={classes.tcell}></td>
                <td className={classes.tcell}></td>
                <td className={classes.tcell}></td>
                <td className={classes.tcell}></td>
                <td className={classes.tcell}></td>
              </tr>
            );
          });
        }
      }
    }
    return (
      <table style={{height:500}}>
        <thead>
          <tr>
            <td className={classes.thead}><br /></td>
            <td className={classes.thead}>วันที่ส่งตัว</td>
            <td className={classes.thead}>วันที่รับตัว</td>
            <td className={classes.thead}>เลขที่ใบส่งตัว</td>
            <td className={classes.thead}>รพ.ปลายทาง</td>
            <td className={classes.thead}>HN</td>
            <td className={classes.thead}>ชื่อสกุล</td>
            <td className={classes.thead}>CID</td>
            <td className={classes.thead}>สิทธิ</td>
            <td className={classes.thead}>การวินิจฉัย</td>
            <td className={classes.thead}>จุดส่งต่อ</td>
            <td className={classes.thead}>แผนก</td>
            <td className={classes.thead}>ประเภทการส่งต่อ</td>
            <td className={classes.thead}>วันหมดอายุ</td>
            <td className={classes.thead}>เรียกเก็บไปที่</td>
            <td className={classes.thead}>จนท.อนุมัติสิทธิ</td>
            <td className={classes.thead}>approve</td>
            <td className={classes.thead}>หมายเหตุ</td>
          </tr>
        </thead>
        <tbody>
          {r}
        </tbody>
      </table>
    );
  }

  useEffect(() => {
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   extractServiceInfo();
  // }, [serviceData]); // eslint-disable-line react-hooks/exhaustive-deps
  
  
  return (
    <div style={{marginBottom:100, width: '100%' }}>

      <div><h5>REFEROUT</h5></div>
      <div style={{  borderRadius: 5, border:'solid 1px #dadada', padding: 10, display: 'flex', justifyContent: 'flex-start' }}>
        <TextField style={{width: 120, marginRight: 5}} label="เลขที่ใบส่งตัว" variant="outlined" />
        <TextField style={{width: 200, marginRight: 5}} label="สถานพยาบาลต้นทาง" variant="outlined" />
        <TextField style={{width: 120, marginRight: 5}} label="HN"variant="outlined" />
        <TextField style={{width: 120, marginRight: 5}} label="ชื่อสกุล" variant="outlined" />
        <TextField style={{width: 120, marginRight: 5}} label="จากวันที่" variant="outlined" />
        <TextField style={{width: 120, marginRight: 5}} label="ถึงวันที่" variant="outlined" />
        <Button
          // onClick={handleClickSearch}
          style={{height:55}}
          variant="contained"
          color="primary"
          startIcon={<MdSearch size={20} />}
        >
          ค้นหา
        </Button>
      </div>
      <div style={{  borderRadius: 5, border:'solid 1px #dadada', padding: 10, marginTop: 10, overfloY: 'hidden', overflowX: 'scroll' }}>
        {mkRows()}
      </div>

    </div>
  )
}
