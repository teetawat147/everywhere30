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
  FormGroup, 
  FormControlLabel, 
  Checkbox,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { th } from "date-fns/locale";

import {
  Pagination
} from '@material-ui/lab';

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { MdSearch, MdRemoveRedEye } from 'react-icons/md';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

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
  const [userHcode, setUserHcode] = useState(null);
  const [sentHcode, setSentHcode] = useState(null);
  const [hmainHcode, setHmainHcode] = useState(null);
  const [cid, setCid] = useState(null);
  const [htCid, setHtCid] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [allPages, setAllPages] = useState();
  const [forcePage, setForcePage] = useState(1);
  const [acSentHcodeDisabled, setAcSentHcodeDisabled] = useState(true);
  const [checkedWI, setCheckedWI] = useState(true);
  const [checkedWO, setCheckedWO] = useState(true);
  const [checkedWZ, setCheckedWZ] = useState(true);

  const [open, setOpen] = React.useState(false);
  const alertOpen = () => { setOpen(true); };
  const alertClose = () => { setOpen(false); };
  const [alertText, setAlertText] = useState('');
  const [alertClass, setAlertClass] = useState('error');

  const [excelData, setExcelData] = useState([]);
  

  const getData = async (page) => {
    let xSkip = 0;
    let xLimit = rowsPerPage;

    if (typeof page !== 'undefined') {
      xSkip = rowsPerPage * page;
    }

    let dateQuery = null;
    if (selectedDate) {
      dateQuery = { "vstdate": ds(selectedDate) };
    }
    else if (selectedMonth) {
      let sMonth = ds(selectedMonth).substr(0, 7);
      let qMonth = [];
      for (let i = 1; i <= 31; ++i) {
        qMonth.push({ "vstdate": sMonth + "-" + az(i, 2) });
      }
      dateQuery = { or: qMonth };
    }
    let cidQuery = null;
    if (cid) {
      cidQuery = { cid: cid };
    }
    let andQuery = [];
    andQuery.push({ hcode: sentHcode });
    // andQuery.push({ an: null });
    let walkinQuery=[];
    if (checkedWI) {
      walkinQuery.push({ walkin_pttype: "wi" });
      walkinQuery.push({ walkin_pttype: "WI" });
    }
    if (checkedWO) {
      walkinQuery.push({ walkin_pttype: "wo" });
      walkinQuery.push({ walkin_pttype: "WO" });
    }
    if (checkedWZ) {
      walkinQuery.push({ walkin_pttype: "wz" });
      walkinQuery.push({ walkin_pttype: "WZ" });
    }
    if (walkinQuery.length>0) {
      andQuery.push({ or : walkinQuery });
    }
    if (hmainHcode) {
      andQuery.push({ hospmain: hmainHcode });
    }
    else {
      andQuery.push({ hospmain: { ne: null } });
    }
    if (cidQuery) {
      andQuery.push(cidQuery);
    }
    if (dateQuery) {
      andQuery.push(dateQuery);
    }
    let xParams = {
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
    // console.log(JSON.stringify(xParams));

    calAllPages(rowsPerPage, { and: andQuery });

    let response = await getAll(xParams, 'interventions');
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          // console.log(response.data);
          setData(response.data);
          setOpenBackdrop(false);
        }
        else {
          setOpenBackdrop(false);
        }
      }
    }

  }

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

  const PDX = (x) => {
    let r='';
    if (typeof x !== 'undefined') {
      x.forEach(i => {
        if (parseInt(i.diagtype)===1) {
          r='('+i.icd10+') '+i.diag_name;
        }
      });
    }
    return r;
  }

  const calPrice = (x) => {
    let r=0;
    if (typeof x !== 'undefined') {
      x.forEach(i => {
        if (typeof i.sum_price !== 'undefined') {
          r=r+parseInt(i.sum_price);
        }
      });
    }
    return r;
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
                <td className={classes.tcell}>{thaiXSDate(i.vstdate)}</td>
                <td className={classes.tcell}>
                  <Tooltip title={<span style={{ fontSize: 16 }}>{i.hcode} {i.hospital.hos_name}</span>} arrow={true} placement="top" >
                    <div style={{ height: 70, overflow: 'hidden', textOverflow: 'ellipsis', width: 150 }}>
                      {i.hcode} {i.hospital.hos_name}
                    </div>
                  </Tooltip>
                </td>
                <td className={classes.tcellWrap}>
                  <Tooltip title={<span style={{ fontSize: 16 }}>{i.hospmain} {i.hospmain_name}</span>} arrow={true} placement="top" >
                    <div style={{ height: 70, overflow: 'hidden', textOverflow: 'ellipsis', width: 150 }}>
                      {i.hospmain} {i.hospmain_name}
                    </div>
                  </Tooltip>
                </td>
                <td className={classes.tcell}>{person.hn}</td>
                <td className={classes.tcell}>{person.fname} {person.lname}</td>
                <td className={classes.tcell}>
                  <div>{person.cid}</div>
                </td>
                <td className={classes.tcellWrap}>
                  <Tooltip title={<span style={{ fontSize: 16 }}>{i.walkin_pttype_name}</span>} arrow={true} placement="top" >
                    <div style={{ height: 70, overflow: 'hidden', textOverflow: 'ellipsis', width: 150 }}>
                      {i.walkin_pttype_name}
                    </div>
                  </Tooltip>
                </td>
                <td className={classes.tcellWrap}>
                  <Tooltip title={<span style={{ fontSize: 16 }}>{PDX(i.activities.diagnosis)}</span>} arrow={true} placement="top" >
                    <div style={{ height: 70, overflow: 'hidden', textOverflow: 'ellipsis', width: 150 }}>
                      {PDX(i.activities.diagnosis)}
                    </div>
                  </Tooltip>
                </td>
                <td className={classes.tcell} style={{ textAlign: 'right' }}>{calPrice(i.activities.treatment).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
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
            <td className={classes.thead}>วันที่รับบริการ</td>
            <td className={classes.thead}>รพ.ผู้ให้บริการ</td>
            <td className={classes.thead}>รพ.ตามสิทธิฯ</td>
            <td className={classes.thead}>HN</td>
            <td className={classes.thead}>ชื่อสกุล</td>
            <td className={classes.thead}>CID</td>
            <td className={classes.thead}>สิทธิ</td>
            <td className={classes.thead}>วินิจฉัยหลัก</td>
            <td className={classes.thead}>ยอดค่าใช้จ่าย</td>
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
              { hos_id: globalState.currentUser.user.department.hcode },
              {
                and: [
                  { zonecode: '08' },
                  {
                    or: [
                      { hos_type_id: '2' },
                      { hos_type_id: '3' },
                      { hos_type_id: '4' },
                      { hos_type_id: '6' },
                      { hos_type_id: '11' },
                      { hos_type_id: '12' },
                      { hos_type_id: '14' }
                    ]
                  }
                ]
              }
            ]
          }
        }
      };

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
                and: [
                  { province_name: globalState.currentUser.user.changwat ||  globalState.currentUser.user.changwat.changwatname},
                  {
                    or: [
                      { hos_type_id: '2' },
                      { hos_type_id: '3' },
                      { hos_type_id: '4' },
                      { hos_type_id: '6' },
                      { hos_type_id: '11' },
                      { hos_type_id: '12' },
                      { hos_type_id: '14' }
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
            hos_id: userHcode
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
            return null;
          });
          setSentHospitalData(x);
        }
      }
    }

    let xParamsB = {
      filter: {
        fields: ["hos_id", "hos_name"],
        order: ["hos_type_id ASC", "hos_id ASC"],
        where: {
          or: [
            { hos_type_id: '2' },
            { hos_type_id: '3' },
            { hos_type_id: '4' },
            { hos_type_id: '6' },
            { hos_type_id: '11' },
            { hos_type_id: '12' },
            { hos_type_id: '14' }
          ]
        }
      }
    };
    // console.log(JSON.stringify(xParamsB));
    let responseB = await getAll(xParamsB, 'hospitals');
    if (responseB.status === 200) {
      if (responseB.data) {
        if (responseB.data.length > 0) {
          let x = [];
          responseB.data.map((i) => {
            x.push({ hos_id: i.hos_id, hos_name: i.hos_id + ' ' + i.hos_name });
            return null;
          });
          setReceiveHospitalData(x);
        }
      }
    }
  }

  const setACVSent = () => {
    if (typeof sentHospitalData !== 'undefined') {
      if (sentHospitalData) {
        let r;
        sentHospitalData.map((i) => {
          if (i['hos_id'] === globalState.currentUser.user.department.hcode) {
            r = i;
          }
          return null;
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

  const filterOptions = createFilterOptions({
    limit: 1000,
  });

  useEffect(() => {
    if (globalState) {
      if (typeof globalState.currentUser !== 'undefined') {
        if (typeof globalState.currentUser.user !== 'undefined') {
          // ดึงข้อมูลจาก globalState มาได้แล้วค่อย get ต่างๆนานา
          setUserHcode(globalState.currentUser.user.department.hcode); 
          if (globalState.userRole === "AdminR8" || globalState.userRole === "AdminChangwat") {
            setAcSentHcodeDisabled(false);
          }
          getData();
          getHospital();
        }
      }
    }
  }, [globalState]); // eslint-disable-line react-hooks/exhaustive-deps


  // useEffect(() => {
  //   if (globalState.userRole === "AdminR8" || globalState.userRole === "AdminChangwat") {
  //     setAcSentHcodeDisabled(false);
  //   }
  //   getData();
  //   getHospital();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    //Format of data to be supported by 'react-csv' library
    const excel = [{
        "column_one":"Username",
        "column_two":"Shama_Ahlawat@external.mckinsey.com"
      },{
        "column_one":"Purpose: Rating",
        "column_two":"50"
      },
      {
        "column_one":"Purpose: Comment 1",
        "column_two":"BBB"
      },
      {
        "column_one":"Purpose: Comment 2",
        "column_two":"CCC"
      }]
    setExcelData(excel);
  }, []);

  const getCsvData = () => {
    const csvData = [['Title']];
    let i;
    for (i = 0; i < excelData.length; i += 1) {
        csvData.push([`${excelData[i].column_one}`, `${excelData[i].column_two}`]);
    }
    return csvData;
  };

  const export_excel = () => {
    console.log(data);
    // setAlertClass('success');
    // setAlertText('อยู่ระหว่างดำเนินการพัฒนา โปรดลองอีกครั้งภายหลัง');
    // alertOpen();

  }

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

      <div><h5>Claim walk-in</h5></div>
      <div style={{ borderRadius: 5, border: 'solid 1px #dadada', padding: 10 }}>
        <div style={{ marginBottom: 10 }}>
          <b>ประเภท : </b>
          <FormControlLabel
            // control={<Checkbox checked={gilad} onChange={handleChange} name="gilad" />}
            control={<Checkbox style={{ padding: 0, margin: 0 }} checked={checkedWI} onChange={(e)=>setCheckedWI(e.target.checked)} />}
            label="ข้าม CUP ในจังหวัด"
            style={{ padding: 0, margin: 0, marginRight: 20 }}
          />
          <FormControlLabel
            control={<Checkbox style={{ padding: 0, margin: 0 }} checked={checkedWO} onChange={(e)=>setCheckedWO(e.target.checked)} />}
            label="ข้ามจังหวัดในเขต"
            style={{ padding: 0, margin: 0, marginRight: 20 }}
          />
          <FormControlLabel
            control={<Checkbox style={{ padding: 0, margin: 0 }} checked={checkedWZ} onChange={(e)=>setCheckedWZ(e.target.checked)} />}
            label="ข้ามเขต"
            style={{ padding: 0, margin: 0, marginRight: 20 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          {sentHospitalData && (
            sentHospitalData.length > 0 && (
              <Autocomplete
                filterOptions={filterOptions}
                disabled={acSentHcodeDisabled}
                style={{ width: 200, marginRight: 5 }}
                options={sentHospitalData}
                onInputChange={(event, newInputValue) => {
                  sentHospitalData.map((i) => {
                    if (i.hos_name === newInputValue) {
                      setSentHcode(i.hos_id);
                    }
                    return null;
                  });
                }}
                defaultValue={setACVSent}
                getOptionLabel={(option) => option.hos_name}
                getOptionSelected={(option, value) => option.hos_name === value.hos_name}
                renderInput={(params) => <TextField {...params} label={'รพ.ผู้ให้บริการ'} variant="outlined" />}
              />
            )
          )}

          {receiveHospitalData && (
            receiveHospitalData.length > 0 && (
              <Autocomplete
                filterOptions={filterOptions}
                style={{ width: 200, marginRight: 5 }}
                options={receiveHospitalData}
                onInputChange={(event, newInputValue) => {
                  if (newInputValue === null || newInputValue === '') {
                    setHmainHcode(null);
                  }
                  receiveHospitalData.map((i) => {
                    if (i.hos_name === newInputValue) {
                      setHmainHcode(i.hos_id);
                    }
                    return null;
                  });
                }}
                getOptionLabel={(option) => option.hos_name}
                getOptionSelected={(option, value) => option.hos_name === value.hos_name}
                renderInput={(params) => <TextField {...params} label={'รพ.ตามสิทธิฯ'} variant="outlined" />}
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
          <Button
            style={{ height: 55 }}
            variant="contained"
            color="secondary"
            startIcon={<ExitToAppIcon size={20} />}
            onClick={e=>export_excel()}
          >
            Excel
          </Button>
        </div>
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
