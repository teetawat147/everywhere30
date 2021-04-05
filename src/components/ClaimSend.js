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

import { getAll } from "../services/UniversalAPI";
import { calcAge, thaiXSDate } from "../services/serviceFunction";

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
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';


import PropTypes from 'prop-types';

import { MdSearch, MdRemoveRedEye } from 'react-icons/md';

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  helperText: {
    color: 'red'
  },
  contentGroup: {
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
    padding: 10,
    backgroundColor: '#E3E3E3',
  },
  tcell: {
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
    borderBottom: 'solid 1px #dadada',
    padding: 10,
  },
  tcellWrap: {
    verticalAlign: 'top',
    borderBottom: 'solid 1px #dadada',
    padding: 10,
  }
});

export default function ClaimSend(props) {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = React.useState(new Date('2021-02-02'));
  const [endDate, setEndDate] = React.useState(new Date());

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  const handleDateChange = (e,x) => {
    console.log(x);
    console.log(e);
  }

  const getData = async () => {

    let xParams = {
      filter: {
        limit: 10,
        // fields:["hcode","vn","an","activities"],
        where: {
          and: [
            {"activities.referout.refer_hospcode": "10711"},
            // {vstdate: {between: [startDate,endDate]}},
            {vstdate: {gte: startDate}},
            {vstdate: {lte: endDate}}
          ]
        },
        order: [
          'vstdate ASC', 
          'refer_hospcode DESC'
        ],
        include: "person"
      }
    };
console.log(xParams);
console.log(JSON.stringify(xParams));
    let response = await getAll(xParams, 'interventions');
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          console.log(response.data);
          // let r=response.data[0];
          // console.log(r);
          setData(response.data);
        }
      }
    }

  }

  const clickRow = (e, d, hcode, vn, cid) => {
    // console.log(d,hcode,vn,cid);
    history.push({ pathname: '/emr', state: { date: d, hcode: hcode, vn: vn, cid: cid } });
  }

  const mkRows = () => {
    let r = [];
    if (typeof data !== 'undefined') {
      if (data) {
        if (data.length > 0) {
          let n = 0;
          data.forEach(i => {
            // console.log(i);
            n++;
            let refer = {};
            let person = {};
            if (typeof i.activities !== 'undefined') {
              if (typeof i.activities.referout !== 'undefined') {
                if (i.activities.referout.length > 0) {
                  refer = i.activities.referout[0];
                }
              }
            }
            if (typeof i.person !== 'undefined') {
              person = i.person;
            }
            r.push(
              <tr key={i.id}>
                <td className={classes.tcell} style={{ paddingLeft: 10, paddingRight: 10 }}>
                  <IconButton key="btnEdit" variant="outlined" color="primary" onClick={(e) => clickRow(e, i.vstdate, i.hcode, i.vn, i.cid)}>
                    <MdRemoveRedEye size={20} />
                  </IconButton>
                </td>
                <td className={classes.tcell}>{n}.</td>
                <td className={classes.tcell}>{typeof refer.refer_date !== 'undefined' ? thaiXSDate(refer.refer_date) : thaiXSDate(refer.date)}</td>
                <td className={classes.tcell}>-</td>
                <td className={classes.tcell}>{typeof refer.refer_number !== 'undefined' ? refer.refer_number : '-'}</td>
                <td className={classes.tcellWrap}>
                  <Tooltip title={<span style={{ fontSize: 16 }}>{typeof refer.refer_hospcode !== 'undefined' ? refer.refer_hospcode : ''} {typeof refer.refer_hospital_name !== 'undefined' ? refer.refer_hospital_name : ''}</span>} arrow={true} placement="top" >
                    <div style={{ height: 70, overflow: 'hidden', textOverflow: 'ellipsis', width: 150 }}>
                      {typeof refer.refer_hospcode !== 'undefined' ? refer.refer_hospcode : ''} {typeof refer.refer_hospital_name !== 'undefined' ? refer.refer_hospital_name : ''}
                    </div>
                  </Tooltip>
                </td>
                <td className={classes.tcell}>{person.hn}</td>
                <td className={classes.tcell}>{person.fname} {person.lname}</td>
                <td className={classes.tcell}>
                  <div>{person.cid}</div>
                </td>
                <td className={classes.tcellWrap}>
                  <Tooltip title={<span style={{ fontSize: 16 }}>{typeof refer.pttype_name !== 'undefined' ? refer.pttype_name : ''}</span>} arrow={true} placement="top" >
                    <div style={{ height: 70, overflow: 'hidden', textOverflow: 'ellipsis', width: 150 }}>
                      {typeof refer.pttype_name !== 'undefined' ? refer.pttype_name : ''}
                    </div>
                  </Tooltip>
                </td>
                <td className={classes.tcellWrap}>
                  <Tooltip title={<span style={{ fontSize: 16 }}>{typeof refer.diag_name !== 'undefined' ? refer.diag_name : ''}</span>} arrow={true} placement="top" >
                    <div style={{ height: 70, overflow: 'hidden', textOverflow: 'ellipsis', width: 150 }}>
                      {typeof refer.diag_name !== 'undefined' ? refer.diag_name : ''}
                    </div>
                  </Tooltip>
                </td>
                <td className={classes.tcell}>{typeof refer.refer_point !== 'undefined' ? refer.refer_point : ''}</td>
                <td className={classes.tcellWrap}>
                  <Tooltip title={<span style={{ fontSize: 16 }}>{typeof refer.department !== 'undefined' ? refer.department : ''}</span>} arrow={true} placement="top" >
                    <div style={{ height: 70, overflow: 'hidden', textOverflow: 'ellipsis', width: 150 }}>
                      {typeof refer.department !== 'undefined' ? refer.department : ''}
                    </div>
                  </Tooltip>
                </td>
                <td className={classes.tcell}>{typeof refer.refer_cause_name !== 'undefined' ? refer.refer_cause_name : ''}</td>
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
      <table>
        <thead>
          <tr>
            <td className={classes.thead}>No.</td>
            <td className={classes.thead}>เลขที่ Ref.</td>
            <td className={classes.thead}>สถานพยาบาลหลักผู้ป่วย</td>
            <td className={classes.thead}>สถานพยาบาลที่รักษา</td>
            <td className={classes.thead}>สถานพยาบาลที่ส่งต่อ</td>
            <td className={classes.thead}>HN (Hcode,Href)</td>
            <td className={classes.thead}>PID</td>
            <td className={classes.thead}>ชื่อสกุล</td>
            <td className={classes.thead}>วันที่รับบริการ</td>
            <td className={classes.thead}>โรคหลัก(pdx)</td>
            <td className={classes.thead}>ยอดค่าใช้จ่าย (1)</td>
            <td className={classes.thead}>check all</td>
          </tr>
        </thead>
        <tbody>
          {/* {r} */}
        </tbody>
      </table>
    );
  }

  useEffect(() => {
    // alert('work list > search, pagination');
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   console.log('startDate- ', startDate);
  // }, [startDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ marginBottom: 100, width: '100%' }}>

      {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{border: 'solid 1px #E2E2E2', padding: 30, borderRadius: 10, backgroundColor: '#EFEFEF', marginTop: 50}}>
          ขออภัยค่ะ อยู่ระหว่างการปรับปรุง
        </div>
      </div> */}

      <div><h5>ส่งเคลม</h5></div>
      <div style={{ borderRadius: 5, border: 'solid 1px #dadada', padding: 10, display: 'flex', justifyContent: 'flex-start' }}>
        <TextField style={{ width: 200, marginRight: 5 }} label="สถานบริการหลักผู้ป่วย" variant="outlined" />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            inputVariant="outlined"
            // margin="normal"
            // id="date-picker-dialog"
            label="วันที่เข้ารับบริการ"
            format="dd/MM/yyyy"
            value={startDate}
            onChange={(date)=>setStartDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={{width: 180, marginRight: 5}}
          />
          <KeyboardDatePicker
            inputVariant="outlined"
            // margin="normal"
            // id="date-picker-dialog"
            label="ถึงวันที่"
            format="dd/MM/yyyy"
            value={endDate}
            onChange={(date)=>setEndDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={{width: 180}}
          />
        </MuiPickersUtilsProvider>
        <TextField style={{ width: 200, marginRight: 5 }} label="PID" variant="outlined" />
        <TextField style={{ width: 120, marginRight: 5 }} label="ประเภทบริการ" variant="outlined" />
        <Button
          // onClick={handleClickSearch}
          style={{ height: 55 }}
          variant="contained"
          color="primary"
          startIcon={<MdSearch size={20} />}
        >
          ค้นหา
        </Button>
      </div>
      <div style={{ borderRadius: 5, border: 'solid 1px #dadada', padding: 10, marginTop: 10, overfloY: 'hidden', overflowX: 'scroll' }}>
        {mkRows()}
      </div>

    </div>
  )
}
