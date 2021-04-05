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

import useGlobal from "../store";
import { getAll, getCount } from "../services/UniversalAPI";
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
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { th } from "date-fns/locale";

import {
  Autocomplete,
  Pagination
} from '@material-ui/lab';

import PropTypes from 'prop-types';

import { MdSearch, MdRemoveRedEye } from 'react-icons/md';

// const useStyles = makeStyles({
const useStyles = makeStyles((theme) => ({
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
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function SearchCID(props) {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [globalState, globalActions] = useGlobal();
  const [sentHospitalData, setSentHospitalData] = useState(null);
  const [receiveHospitalData, setReceiveHospitalData] = useState(null);
  const [sentHcode, setSentHcode] = useState(null);
  const [receiveHcode, setReceiveHcode] = useState(globalState.currentUser.user.department.hcode);
  const [cid, setCid] = useState(null);
  const [htCid, setHtCid] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [allPages, setAllPages] = useState();
  const [forcePage, setForcePage] = useState(1);
  const [acRecieveHcodeDisabled, setAcRecieveHcodeDisabled] = useState(true);


  const getData = async (page) => {
    let xSkip = 0;
    let xLimit = rowsPerPage;

    if (typeof page !== 'undefined') {
      xSkip = rowsPerPage * page;
    }

    // ใช้ lte gte กับ วันที่ใน DB ที่เก็บเป็น string ไม่ได้ user inrerface 
    // ก็ให้เลือกเดือน แล้วสร้าง query เป็น or วันที่ 1 - 31 เอา ลำบากได้อีก
    // let x = {"include":"person","limit":5,"where":{"and":[{"hcode":"11046"},{"activities.referout.refer_hospcode":{"ne":null}},{"or":[{"activities.referout.date":"2021-02-01"},{"activities.referout.date":"2021-02-02"},{"activities.referout.date":"2021-02-03"},{"activities.referout.date":"2021-02-04"},{"activities.referout.date":"2021-02-05"},{"activities.referout.date":"2021-02-06"},{"activities.referout.date":"2021-02-07"},{"activities.referout.date":"2021-02-08"},{"activities.referout.date":"2021-02-09"},{"activities.referout.date":"2021-02-10"},{"activities.referout.date":"2021-02-11"},{"activities.referout.date":"2021-02-12"},{"activities.referout.date":"2021-02-13"},{"activities.referout.date":"2021-02-14"},{"activities.referout.date":"2021-02-15"},{"activities.referout.date":"2021-02-16"},{"activities.referout.date":"2021-02-17"},{"activities.referout.date":"2021-02-18"},{"activities.referout.date":"2021-02-19"},{"activities.referout.date":"2021-02-20"},{"activities.referout.date":"2021-02-21"},{"activities.referout.date":"2021-02-22"},{"activities.referout.date":"2021-02-23"},{"activities.referout.date":"2021-02-24"},{"activities.referout.date":"2021-02-25"},{"activities.referout.date":"2021-02-26"},{"activities.referout.date":"2021-02-27"},{"activities.referout.date":"2021-02-28"},{"activities.referout.date":"2021-02-29"},{"activities.referout.date":"2021-02-30"},{"activities.referout.date":"2021-02-31"}]}]}}

    // ถ้าระบุวันที่มา ให้เลือก query แบบวันเดือน ถ้าเลือกเดือนมาให้ query แบบ or 31 วันในเดือนที่เลือกมา
    let dateQuery = null;
    if (selectedDate) {
      dateQuery = { "activities.referout.date": ds(selectedDate) };
    }
    else if (selectedMonth) {
      let sMonth = ds(selectedMonth).substr(0, 7);
      let qMonth = [];
      for (let i = 1; i <= 31; ++i) {
        qMonth.push({ "activities.referout.date": sMonth + "-" + az(i, 2) });
      }
      // console.log(qMonth);  
      dateQuery = { or: qMonth };
    }
    let cidQuery = null;
    if (cid) {
      cidQuery = { cid: cid };
    }
    let andQuery = [];

    console.log(sentHcode);
    console.log(receiveHcode);

    if (sentHcode) {
      andQuery.push({ hcode: sentHcode });
    }
    else {
      // andQuery.push({ hcode: { ne: null } });
    }

    if (receiveHcode) {
      andQuery.push({ "activities.referout.refer_hospcode": receiveHcode });
    }
    else {
      andQuery.push({ "activities.referout.refer_hospcode": { ne: null } });
    }

    if (cidQuery) {
      andQuery.push(cidQuery);
    }
    if (dateQuery) {
      andQuery.push(dateQuery);
    }
    let xParams = {
      // ปัญหา filter LOOPBACK 
      // ค้น refer_hospcode not null อย่างเดียว ไม่ได้ ต้องมี refer date กำกับ จะขึ้้น timeout
      // ค้น cid กับ refer_hospcode not null ได้ ไม่ต้องมี refer date กำกับ
      filter: {
        limit: xLimit,
        skip: xSkip,
        include: ["hospital", "person"],
        where: {
          and: andQuery
        },
      }
    };
    // console.log(xParams);
    console.log(JSON.stringify(xParams));

    calAllPages(rowsPerPage, { and: andQuery });

    let response = await getAll(xParams, 'interventions');
    console.log(response.data);
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          setData(response.data);
          setOpenBackdrop(false);
        }
        else {
          setOpenBackdrop(false);
        }
      }
    }

  }

  // calAllPages(rowsPerPage, filter_where);

  const calAllPages = async (rowsPerPage, filter_where) => {
    let xWhere = {};
    if (typeof filter_where !== 'undefined') {
      xWhere = filter_where;
    }
    let xParams = { where: xWhere };
    let documentsCount = await getCount(xParams, 'interventions');
    setAllPages(parseInt(Math.ceil(parseInt(documentsCount.data.count) / parseInt(rowsPerPage))));
  }

  const ds = (x) => {
    let y = x.getFullYear().toString();
    let m = az(x.getMonth() + 1, 2);
    let d = az(x.getDate(), 2);
    let ymd = y + '-' + m + '-' + d;
    return ymd;
  }

  const az = (x, n) => {
    let r = x.toString();
    for (var i = 0; i < n - r.length; ++i) {
      r = '0' + r;
    }
    return r;
  }




  const clickRow = (e, d, hcode, vn, cid) => {
    history.push({ pathname: '/emr', state: { date: d, hcode: hcode, vn: vn, cid: cid } });
  }

  const mkRows = () => {
    let r = [];
    if (typeof data !== 'undefined') {
      if (data) {
        if (data.length > 0) {
          let n = 0;
          data.forEach(i => {
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
                <td className={classes.tcell}>{((forcePage - 1) * rowsPerPage) + n}.</td>
                <td className={classes.tcell}>{typeof refer.refer_date !== 'undefined' ? thaiXSDate(refer.refer_date) : thaiXSDate(refer.date)}</td>
                <td className={classes.tcell}>{i.hcode} {i.hospital.hos_name}</td>
                {/* <td className={classes.tcell}>-</td> */}
                {/* <td className={classes.tcell}>{typeof refer.refer_number !== 'undefined' ? refer.refer_number : '-'}</td> */}
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
                {/* <td className={classes.tcell}></td>
                <td className={classes.tcell}></td>
                <td className={classes.tcell}></td>
                <td className={classes.tcell}></td>
                <td className={classes.tcell}></td> */}
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
            <td className={classes.thead}><br /></td>
            <td className={classes.thead}><br /></td>
            <td className={classes.thead}>วันที่ส่งตัว</td>
            {/* <td className={classes.thead}>วันที่รับตัว</td> */}
            {/* <td className={classes.thead}>เลขที่ใบส่งตัว</td> */}
            <td className={classes.thead}>รพ.ต้นทาง</td>
            <td className={classes.thead}>รพ.ปลายทาง</td>
            <td className={classes.thead}>HN</td>
            <td className={classes.thead}>ชื่อสกุล</td>
            <td className={classes.thead}>CID</td>
            <td className={classes.thead}>สิทธิ</td>
            <td className={classes.thead}>การวินิจฉัย</td>
            <td className={classes.thead}>จุดส่งต่อ</td>
            <td className={classes.thead}>แผนก</td>
            <td className={classes.thead}>ประเภทการส่งต่อ</td>
            {/* <td className={classes.thead}>วันหมดอายุ</td>
            <td className={classes.thead}>เรียกเก็บไปที่</td>
            <td className={classes.thead}>จนท.อนุมัติสิทธิ</td>
            <td className={classes.thead}>approve</td>
            <td className={classes.thead}>หมายเหตุ</td> */}
          </tr>
        </thead>
        <tbody>
          {r}
        </tbody>
      </table>
    );
  }

  const getHospital = async () => {
    // AdminR8 -- ไม่ต้องกรอง hospital
    // AdminChangwat -- กรอง hospital แสดงเฉพาะจังหวัดตนเอง
    // อื่นๆ  -- กรอง hospital แสดงเฉพาะหน่วยงานตนเอง และ disabled ด้วย
    let xParams = {};
    if (globalState.userRole === "AdminR8") {
      
      xParams = {
        filter: {
          fields: ["hos_id", "hos_name"],
          order: ["hos_type_id ASC", "hos_id ASC"],
          where: {
            or: [
              { hos_id: globalState.currentUser.user.department.hcode }
              , { hos_type_id: '2' }
              , { hos_type_id: '3' }
              , { hos_type_id: '4' }
              , { hos_type_id: '6' }
            ]
          }
        }
      };

      // xParams = {
      //   filter: {
      //     fields: ["hos_id", "hos_name"],
      //     order: ["hos_type_id ASC", "hos_id ASC"],
      //     where: {
      //       or: [
      //         { hos_id: globalState.currentUser.user.department.hcode },
      //         {
      //           and: [
      //             { zonecode: '08'},
      //             {
      //               or: [
      //                 { hos_type_id: '2' },
      //                 { hos_type_id: '3' },
      //                 { hos_type_id: '4' },
      //                 { hos_type_id: '6' }
      //               ]
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   }
      // };

    }
    else if (globalState.userRole === "AdminChangwat") {
      xParams = {
        filter: {
          fields: ["hos_id", "hos_name"],
          order: ["hos_type_id ASC", "hos_id ASC"],
          where: {
            or: [
              { hos_id: globalState.currentUser.user.department.hcode },
              { 
                and : [
                  { province_name: globalState.currentUser.user.changwat },
                  {
                    or : [
                      { hos_type_id: '2' },
                      { hos_type_id: '3' },
                      { hos_type_id: '4' },
                      { hos_type_id: '6' }
                    ]
                  }
                ]
              }
            ]
          }
        }
      };
    }
    else {
      xParams = {
        filter: {
          fields: ["hos_id", "hos_name"],
          order: ["hos_type_id ASC", "hos_id ASC"],
          where: {
            hos_id: globalState.currentUser.user.department.hcode
          }
        }
      };
    }
    
    let response = await getAll(xParams, 'hospitals');
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          let x = [];
          response.data.map((i) => {
            x.push({ hos_id: i.hos_id, hos_name: i.hos_id + ' ' + i.hos_name });
          });
          setReceiveHospitalData(x);
        }
      }
    }

    let xParamsB = {
      filter: {
        fields: ["hos_id", "hos_name"],
        order: ["hos_type_id ASC","hos_id ASC"],
        where: {
          or: [
            {hos_type_id:'2'}
            ,{hos_type_id:'3'}
            ,{hos_type_id:'4'}
            ,{hos_type_id:'6'}
          ]
        }
      }
    };

    let responseB = await getAll(xParamsB, 'hospitals');
    if (responseB.status === 200) {
      if (responseB.data) {
        if (responseB.data.length > 0) {
          let x = [];
          responseB.data.map((i) => {
            x.push({ hos_id: i.hos_id, hos_name: i.hos_id + ' ' + i.hos_name });
          });
          setSentHospitalData(x);
        }
      }
    }
  }

  const setACVReceive = () => {
    if (typeof receiveHospitalData !== 'undefined') {
      if (receiveHospitalData) {
        let r;
        receiveHospitalData.map((i) => {
          if (i['hos_id'] === globalState.currentUser.user.department.hcode) {
            r = i;
          }
        });
        return r;
      }
    }
  }

  const clickSearch = () => {
    setData(null);
    setOpenBackdrop(true);
    getData();
    setForcePage(1);
    setAllPages(0);
  }

  const changeCid = (e) => {
    setCid(null);
    let cid = e.target.value;
    if (cid) {
      if (cid.length === 13) {
        setHtCid(null);
        setCid(e.target.value);
      }
      else {
        setHtCid('ตัวเลขต้องครบ13หลัก');
      }
    }
  }

  const closeBackdrop = () => {
    setOpenBackdrop(false);
  }

  const onClickPage = (e, page) => {
    setOpenBackdrop(true);
    getData(page - 1);
    setForcePage(page);
  }

  useEffect(() => {
    // console.log(globalState);
    if (globalState.userRole === "AdminR8" || globalState.userRole === "AdminChangwat") {
      setAcRecieveHcodeDisabled(false);
    }
    getData();
    getHospital();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ marginBottom: 100, width: '100%' }}>

      {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{border: 'solid 1px #E2E2E2', padding: 30, borderRadius: 10, backgroundColor: '#EFEFEF', marginTop: 50}}>
          ขออภัยค่ะ อยู่ระหว่างการปรับปรุง
        </div>
      </div> */}

      <Backdrop className={classes.backdrop} open={openBackdrop} onClick={closeBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <div><h5>REFERIN</h5></div>
      <div style={{ borderRadius: 5, border: 'solid 1px #dadada', padding: 10, display: 'flex', justifyContent: 'flex-start' }}>
        {/* <TextField style={{ width: 120, marginRight: 5 }} label="เลขที่ใบส่งตัว" variant="outlined" disabled={true} /> */}
        {/* <TextField style={{ width: 200, marginRight: 5 }} label="รพ.ต้นทาง" variant="outlined" /> */}

        {sentHospitalData && (
          sentHospitalData.length>0 && (
            <Autocomplete
              style={{ width: 200, marginRight: 5 }}
              options={sentHospitalData}
              onInputChange={(event, newInputValue) => {
                if (newInputValue===null || newInputValue==='') {
                  setSentHcode(null);
                }
                sentHospitalData.map((i) => {
                  if (i.hos_name === newInputValue) {
                    setSentHcode(i.hos_id);
                  }
                });
              }}
              getOptionLabel={(option) => option.hos_name}
              getOptionSelected={(option, value) => option.hos_name === value.hos_name}
              renderInput={(params) => <TextField {...params} label={'รพ.ต้นทาง'} variant="outlined" />}
            />
          )
        )}

        {receiveHospitalData && (
          receiveHospitalData.length>0 && (
            <Autocomplete
              disabled={acRecieveHcodeDisabled}
              style={{ width: 200, marginRight: 5 }}
              options={receiveHospitalData}
              onInputChange={(event, newInputValue) => {
                receiveHospitalData.map((i) => {
                  if (i.hos_name === newInputValue) {
                    setReceiveHcode(i.hos_id);
                  }
                });
              }}
              defaultValue={setACVReceive}
              getOptionLabel={(option) => option.hos_name}
              getOptionSelected={(option, value) => option.hos_name === value.hos_name}
              renderInput={(params) => <TextField {...params} label={'รพ.ปลายทาง'} variant="outlined" />}
            />
          )
        )}

        <TextField
          style={{ width: 150, marginRight: 5 }}
          label="CID"
          variant="outlined"
          onChange={(e) => { changeCid(e) }}
          helperText={htCid}
          FormHelperTextProps={{ color: 'red' }}
        />
        {/* <TextField style={{ width: 120, marginRight: 5 }} label="ชื่อสกุล" variant="outlined" disabled={true} /> */}
        <MuiPickersUtilsProvider locale={th} utils={DateFnsUtils} >
          <KeyboardDatePicker
            clearable
            inputVariant="outlined"
            label="เลือกวันที่"
            format="dd/MM/yyyy"
            value={selectedDate}
            onChange={(date) => { setSelectedDate(date); setSelectedMonth(null); }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={{ width: 180, marginRight: 5 }}
          />
          <KeyboardDatePicker
            views={["year", "month"]}
            clearable
            inputVariant="outlined"
            label="เลือกเดือน"
            format="MM/yyyy"
            value={selectedMonth}
            onChange={(date) => { setSelectedMonth(date); setSelectedDate(null); }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={{ width: 180, marginRight: 5 }}
          />

          {/* <KeyboardDatePicker
            clearable
            inputVariant="outlined"
            label="จากวันที่"
            format="dd/MM/yyyy"
            value={startDate}
            onChange={(date)=>setStartDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={{width: 180, marginRight: 5}}
          />
          <KeyboardDatePicker
            clearable
            inputVariant="outlined"
            label="ถึงวันที่"
            format="dd/MM/yyyy"
            value={endDate}
            onChange={(date)=>setEndDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            style={{width: 180}}
          /> */}
        </MuiPickersUtilsProvider>
        <Button
          onClick={clickSearch}
          style={{ height: 55 }}
          variant="contained"
          color="primary"
          startIcon={<MdSearch size={20} />}
        >
          ค้นหา
        </Button>
      </div>

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Pagination count={allPages} page={forcePage} onChange={onClickPage} color="primary" />
      </div>

      <div style={{ borderRadius: 5, border: 'solid 1px #dadada', padding: 10, marginTop: 10, overfloY: 'hidden', overflowX: 'scroll' }}>
        {mkRows()}
      </div>

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Pagination count={allPages} page={forcePage} onChange={onClickPage} color="primary" />
      </div>

    </div>
  )
}
