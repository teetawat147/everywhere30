/* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles
} from '@material-ui/core/styles';
// npm install use-mediaquery --save

import useMediaQuery from '@material-ui/core/useMediaQuery';

// import UDataTable from "./UniversalDataTable";
// import UCard from "./UniversalCard";
// import UListTable from "./UniversalListTable";

import { get, getAll, patch } from "../services/UniversalAPI";
import logSave from "../services/SaveLog";
import * as AuthService from "../services/auth.service";

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
  CircularProgress,
  Backdrop,
  Grid,
  InputAdornment,
} from '@material-ui/core';

import PropTypes from 'prop-types';

import { MdSearch, MdSwapHoriz, MdSwapVert, MdClear } from 'react-icons/md';

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
  linkDateServOPD: {
    color: 'black',
    cursor: 'pointer',
    '&:hover': {
      background: "#cdf1ff",
    },
  },
  linkDateServIPD: {
    color: 'red',
    cursor: 'pointer',
    '&:hover': {
      background: "#cdf1ff",
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  boxHead: {
    marginTop: 0,
    marginBottom: 0,
    paddingLeft: 10,
    paddingBottom: 2,
    paddingTop: 2,
    backgroundColor: '#f7fafb',
    borderRadius: 8
  },
  boxHeadContain: {
    border: 'solid 1px #A0A0A0',
    borderRadius: 7,
    marginBottom: 10
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      // style={{ backgroundColor: '#f2f2f2', padding: '0px', margin: '0px', border: 'solid 1px #1890ff' }}
      style={{ padding: 10, margin: 0, border: 'none' }}
      {...other}
    >
      {value === index && (
        <Box
          // p={3}
          style={{ padding: '5px' }}
        >
          {/* <Typography>{children}</Typography> */}
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function SearchCID(props) {
  const classes = useStyles();
  const [searchCID, setSearchCID] = useState(null);
  const [searchCIDValue, setSearchCIDValue] = useState('');
  const [cidHelperText, setCidHelperText] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [interventionData, setinterventionData] = useState([]);
  const [serviceData, setServiceData] = useState({});
  const [yearShow, setYearShow] = useState({});
  const [assessmentListData, setAssessmentListData] = useState([]);
  const [hcodeData, setHcodeData] = useState({});
  const [currentView, setCurrentView] = useState('summary');
  const [tabValue, setTabValue] = useState(0);
  const [serviceInfoData, setServiceInfoData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedHCode, setSelectedHCode] = useState('all');
  const [dialogText, setDialogText] = useState('');
  // const [needConsent, setNeedConsent] = useState(2);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [searchPassport, setSearchPassport] = useState(null);
  const [searchPassportValue, setSearchPassportValue] = useState('');
  const [passportHelperText, setPassportHelperText] = useState(null);
  const [showClearSearchPassportButton, setShowClearSearchPassportButton] = useState('none');
  const [showClearSearchCIDButton, setShowClearSearchCIDButton] = useState('none');
  const [searchButtonDisabled, setSearchButtonDisabled] = useState(true);
  // ข้ามเขต
  const [dataFromMoph, setDataFromMoph] = useState('');

  const [openDialogEMR1hr, setOpenDialogEMR1hr] = useState(false);
  const [displayEMR1hrButton, setDisplayEMR1hrButton] = useState('none');
  const currentUser = AuthService.getCurrentUser();
  const [displayEMR60mCountDown, setDisplayEMR60mCountDown] = useState('none');
  const [EMR60mLeft, setEMR60mLeft] = useState(0);


  const onchangeSearchText = (e) => {
    setSearchCIDValue(e.target.value);
    let v = e.target.value;
    let invalid = [];
    if (v.length !== 13) {
      invalid.push('กรอกตัวเลขให้ครบ 13 หลัก');
    }
    if (!(/^[0-9]+$/.test(v))) {
      invalid.push('เฉพาะตัวเลขเท่านั้น');
    }

    if (invalid.length === 0) {
      setSearchCID(v);
      setCidHelperText('');
      setSearchButtonDisabled(false);
    }
    else {
      setSearchCID(null);
      setCidHelperText(invalid.join(', '));
      setSearchButtonDisabled(true);
    }

    if (v.length > 0) {
      setShowClearSearchCIDButton('inline-block');
    }
    else {
      setShowClearSearchCIDButton('none');
    }
  }

  const onchangeSearchPassport = (e) => {
    setSearchPassportValue(e.target.value);
    let v = e.target.value;
    let invalid = [];
    if (v.length < 5) {
      invalid.push('กรอกตัวเลขหรืออักษรภาษาอังกฤษอย่างน้อย 5 ตัว');
    }
    // if (!(/^[a-zA-Z0-9]+$/.test(v))) {
    //   invalid.push('เฉพาะตัวเลขหรืออักษรภาษาอังกฤษเท่านั้น');
    // }

    if (invalid.length === 0) {
      setSearchPassport(v);
      setPassportHelperText('');
      setSearchButtonDisabled(false);
    }
    else {
      setSearchPassport(null);
      setPassportHelperText(invalid.join(', '));
      setSearchButtonDisabled(true);
    }

    if (v.length > 0) {
      setShowClearSearchPassportButton('inline-block');
    }
    else {
      setShowClearSearchPassportButton('none');
    }
  }

  const handleClickSearch = async (e, cid) => {
    setPatientData([]);
    setinterventionData([]);
    setServiceData({});
    setYearShow({});
    setAssessmentListData([]);
    setHcodeData({});
    setServiceInfoData({});
    setSelectedHCode('all');
    setDisplayEMR60mCountDown('none');
    setEMR60mLeft(0);

    let c = null;
    if (cid === null) {
      // ไม่มี cid ส่งมาด้วย ให้ไปเอาจาก state
      // เช็คว่า search ด้วย passport หรือป่าว
      if (searchPassport !== null) {
        setOpenBackdrop(true);
        let xParams = {
          filter: {
            where: {
              passport_no: searchPassport
            },
            fields: ["id", "cid", "passport_no"]
          }
        };
        let response = await getAll(xParams, 'people');
        if (response.status === 200) {
          if (response.data) {
            if (typeof response.data[0] !== 'undefined') {
              if (typeof response.data[0].cid !== 'undefined') {
                if (response.data[0].cid.length === 13) {
                  preGetPersonInfo(response.data[0].cid);
                }
              }
            }
          }
        }
      }
      else {
        if (typeof searchCID !== 'undefined') {
          if (searchCID !== null) {
            preGetPersonInfo(searchCID);
          }
        }
      }
    }
    else {
      // มี cid ส่งมาด้วย (คือ cid ที่ส่งมาจากหน้า referin / referout)
      if (typeof cid !== 'undefined') {
        if (cid !== null) {
          preGetPersonInfo(c);
        }
      }
    }
  }

  const diff_minutes = (dt2, dt1) => {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  const preGetPersonInfo = async (cid) => {
    setOpenBackdrop(true);
    let c = cid;
    let xParams = { filter: { where: { key: "emrRequiredConsent" } } };
    let response = await getAll(xParams, 'SystemSettings');
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          if (response.data[0].value.toString() === "1") {

            let inRequestPeriod = false;
            let responseU = await get(currentUser.userId, 'teamusers');
            if (responseU.status === 200) {
              if (responseU.data) {
                // console.log(responseU.data);
                if (typeof responseU.data.temporaryAccessEMR !== 'undefined') {
                  if (responseU.data.temporaryAccessEMR.cid === c) {
                    let minutesTimeout = responseU.data.temporaryAccessEMR.minutes;
                    let startDateTime = responseU.data.temporaryAccessEMR.startDateTime;
                    let minutesDiff = diff_minutes(new Date(), new Date(startDateTime));
                    // console.log(minutesDiff);
                    if (parseInt(minutesDiff) <= parseInt(minutesTimeout)) {
                      inRequestPeriod = true;
                      setEMR60mLeft(60 - minutesDiff);
                      setDisplayEMR60mCountDown('block');
                    }
                  }
                }
              }
            }

            if (inRequestPeriod) {
              getPersonInfo(c);
              // ดูข้อมูลข้ามเขต
              getFromMOPH(c);
            }
            else {
              checkConsent(c);
              // TEST
              getFromMOPH(c);
            }

          }
          else {
            getPersonInfo(c);
            // ดูข้อมูลข้ามเขต
            getFromMOPH(c);
          }
        }
      }
    }
  }

  const checkConsent = async (cid) => {
    let xParams = {
      filter: {
        where: {
          cid: cid
        },
        include: "consent",
        fields: ["id", "cid", "consent"]
      }
    };

    // console.log(xParams);
    let response = await getAll(xParams, 'people');
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {

          let pd = response.data;
          let allowedDoctor = [];
          pd.forEach(i => {
            if (typeof i.consent !== 'undefined') {
              if (i.consent && Object.keys(i.consent).length > 0) {
                if (typeof i.consent.allowedDoctor !== 'undefined') {
                  if (i.consent.allowedDoctor && i.consent.allowedDoctor.length > 0) {
                    i.consent.allowedDoctor.forEach(z => {
                      allowedDoctor.push(z);
                    });
                  }
                }
              }
            }
          });

          if (currentUser.user.role.toLowerCase() === 'doctor') {
            let xParams = { filter: { where: { key: "emrTemporaryBreakConsent" } } };
            let responseS = await getAll(xParams, 'SystemSettings');
            if (responseS.status === 200) {
              if (responseS.data) {
                if (responseS.data.length > 0) {
                  if (responseS.data[0].value.toString() === "1") {
                    setDisplayEMR1hrButton('inline-block');
                  }
                  else {
                    setDisplayEMR1hrButton('none');
                  }
                }
              }
            }
          }

          let thisUserAllowed = false;
          allowedDoctor.forEach(i => {
            if (currentUser.user.id === i.id) {
              thisUserAllowed = true;
            }
          });

          // if (typeof response.data[0].consent === 'undefined') {
          if (thisUserAllowed === false) {
            setOpenBackdrop(false);
            // setDialogText(<div><b>ผู้ป่วยยังไม่ยื่นเอกสาร Consent</b><br />กรุณาประสานงานให้ผู้ป่วยติดต่อยื่นเอกสาร Consent กับเจ้าหน้าที่ที่เกี่ยวข้อง เพื่อยืนยันการเปิดเผยข้อมูลประวัติการรักษาพยาบาลค่ะ</div>);
            setDialogText(<div><b>ต้องการเอกสาร Consent ที่อนุญาติให้ท่าน<span style={{ color: 'blue'}} >({currentUser.user.fullname})</span>เข้าถึงข้อมูล</b><br />กรุณาประสานงานให้ผู้ป่วยติดต่อยื่นเอกสาร Consent กับเจ้าหน้าที่ที่เกี่ยวข้อง เพื่อยืนยันการเปิดเผยข้อมูลประวัติการรักษาพยาบาล โดยระบุให้ท่าน<span style={{ color: 'blue'}} >({currentUser.user.fullname})</span>สามารถเข้าถึงข้อมูลดังกล่าวได้ค่ะ</div>);
            setOpenDialog(true);
          }
          else {
            getPersonInfo(cid);
            // ดูข้อมูลข้ามเขต
            // getFromMOPH(cid);
          }
        }
        else {
          setOpenBackdrop(false);
          setDialogText('ไม่พบข้อมูลของ CID นี้');
          setOpenDialog(true);
        }
      }
    }
  }

  const API_MOPH = process.env.REACT_APP_API_MOPH;
  const TK_MOPH = process.env.REACT_APP_TK_MOPH;
  const getFromMOPH = async (cid) => {
    var axios = require('axios');
    var data = '';

    var config = {
      method: 'get',
      url: API_MOPH + 'search/' + cid,
      headers: {
        'Authorization': 'Bearer ' + TK_MOPH
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        if (response.data.results !== null) {
          setDataFromMoph('ดูประวัติรับบริการ');
        } else {
          setDataFromMoph('--ไม่พบประวัติรับบริการ --');
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getPersonInfo = async (cid) => {
    setPatientData([]);
    setinterventionData([]);
    setServiceData({});
    let xParams = {
      filter: {
        where: { cid: cid },
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
    // console.log(xParams);
    let response = await getAll(xParams, 'people');
    // console.log(response);
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          setOpenBackdrop(false);
          logSave('search --- CID:' + cid);
          // let l=logSave('search --- CID:'+c);
          // console.log(JSON.stringify(l));
          // console.log(response.data);
          let r = response.data[0];
          // console.log(r);
          let x = [];
          x['cid'] = r['cid'];
          x['pt_name'] = r['fname'] + ' ' + r['lname'];
          x['birthday'] = r['birthday'];
          x['age'] = calcAge(r['birthday']);
          x['bloodgrp'] = r['bloodgrp'];
          x['address_info'] = r['informaddr'];
          x['drugallergy'] = (r['drugallergy'] !== '' ? r['drugallergy'] : 'ไม่พบข้อมูลการแพ้ยา');
          setPatientData(x);
          let intervention = r.intervention;
          if (typeof intervention != 'undefined') {
            if (intervention.length > 0) {
              intervention.sort(function (a, b) {
                // b-a เรียงมากไปน้อย
                // a-b เรียงน้อยไปมาก
                let ax = (typeof a.an !== 'undefined' ? '2' : '1');
                let bx = (typeof b.an !== 'undefined' ? '2' : '1');
                let ai = parseInt((new Date(a.vstdate).getTime()).toString() + ax);
                let bi = parseInt((new Date(b.vstdate).getTime()).toString() + bx);
                return bi - ai;
              });
              setinterventionData(intervention);

              // กดดูประวัติมาจากหน้า refer -- START
              let s = null;
              if (typeof props.history.location.state !== 'undefined') {
                s = props.history.location.state;
              }
              if (s) {
                intervention.forEach(i => {
                  // if (i.date===d) {
                  if (i.hcode === s.hcode && i.vn === s.vn) {
                    x = i;
                  }
                });
                setServiceData(x);
              }
              // กดดูประวัติมาจากหน้า refer -- END
            }
          }
        }
        else {
          setOpenBackdrop(false);
          setDialogText('ไม่พบข้อมูลของ CID นี้');
          setOpenDialog(true);
        }
      }
    }
  }

  const mkYearShow = () => {
    let yearShowTemp = {};
    let lastYear = '';
    let n = 0;
    interventionData.forEach(i => {
      if (typeof i.vstdate != 'undefined') {
        n++;
        let x = (parseInt(i.vstdate.substr(0, 4)) + 543).toString();
        yearShowTemp[x] = 'none';
        if (n === 1) {
          lastYear = x;
        }
      }
    });
    yearShowTemp[lastYear] = 'block';
    setYearShow(yearShowTemp);
  }

  const dateServList = () => {
    if (interventionData.length > 0) {
      let yearsData = [];
      interventionData.forEach(i => {
        // console.log(selectedHCode);
        let x = (parseInt(i.vstdate.substr(0, 4)) + 543).toString();
        let an = (typeof i.an !== 'undefined' ? i.an : null);
        if (typeof yearsData[x] === 'undefined') {
          if (selectedHCode === 'all') {
            yearsData[x] = [];
            yearsData[x].push({ hcode: i.hcode, vn: i.vn, an: an, date: i.vstdate, hos_name: i.hospital.hos_name });
          }
          else if (selectedHCode === i.hcode) {
            yearsData[x] = [];
            yearsData[x].push({ hcode: i.hcode, vn: i.vn, an: an, date: i.vstdate, hos_name: i.hospital.hos_name });
          }
        }
        else {
          if (selectedHCode === 'all') {
            yearsData[x].push({ hcode: i.hcode, vn: i.vn, an: an, date: i.vstdate, hos_name: i.hospital.hos_name });
          }
          else if (selectedHCode === i.hcode) {
            yearsData[x].push({ hcode: i.hcode, vn: i.vn, an: an, date: i.vstdate, hos_name: i.hospital.hos_name });
          }
        }
      });

      // console.log(yearsData);

      let yearList = [];
      yearsData.reverse();
      yearsData.forEach(y => {
        let dateList = [];
        let yearTitle = "";
        let dateCount = y.length;
        let i = 0;
        // console.log(y);
        y.forEach(d => {
          // console.log(d);
          i++;
          yearTitle = (parseInt(d.date.substr(0, 4)) + 543).toString();
          let io = (d.an ? 'IPD' : 'OPD');
          let an_number = (d.an ? 'AN=' + d.an + '' : '');
          let classIO = (d.an ? classes.linkDateServIPD : classes.linkDateServOPD);
          dateList.push(
            <Tooltip title={<span style={{ fontSize: 16 }}>{d.hos_name} ({d.hcode}) {an_number}</span>} arrow={true} placement="right" key={d.date.toString() + '_' + i} >
              <div
                className={classIO}
                onClick={(e) => selectDateServ(e, d.date, d.hcode, d.vn, d.an)}
                style={{ width: '100%', height: 25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2, borderRadius: 10, paddingLeft: 5 }}
              >
                {thaiXSDate(d.date)} ({io}) {d.hos_name}
              </div>
            </Tooltip>
          );
        });
        yearList.push(
          <div key={yearTitle}>
            <div
              style={{ fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#e2e2e2', borderRadius: 10, marginTop: 5, paddingLeft: 10 }}
              onClick={() => toggleYear(yearTitle)}
            >
              พ.ศ. {yearTitle} ({dateCount})
            </div>
            <div style={{ display: yearShow[yearTitle] }}>
              {dateList}
            </div>
          </div>
        );
      });
      return yearList;
    }
    else {
      return null;
    }
  }

  const toggleYear = (x) => {
    let a = yearShow;
    let o = a[x];
    a[x] = (o === 'none' ? 'block' : 'none');
    setYearShow({ ...yearShow, ...a });
  }

  const selectDateServ = (e, date, hcode, vn, an) => {
    let x = {};
    interventionData.forEach(i => {
      let this_an = (typeof i.an === 'undefined' ? null : i.an);
      if (i.hcode === hcode && i.vstdate === date && i.vn === vn && this_an === an) {
        x = i;
      }
    });
    // console.log(x);
    logSave('display service info --- DATE:' + date + ' HCODE:' + hcode + ' VN:' + vn + ' AN:' + an + ' CID:' + searchCID);
    setServiceData(x);
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const serviceDataBlock = () => {
    // console.log(currentView);
    let assessment = {};
    let diagnosis = [];
    let treatment = [];
    let laboratory = [];
    let radiology = [];
    let referout = [];
    if (Object.keys(serviceData).length > 0) {
      if (serviceData.activities) {
        // console.log(serviceData.activities.assessment);
        if (typeof serviceData.activities.assessment !== 'undefined') {
          if (serviceData.activities.assessment !== null && serviceData.activities.assessment.length > 0) {
            assessment = serviceData.activities.assessment[0];
          }
        }
        if (typeof serviceData.activities.diagnosis !== 'undefined' && serviceData.activities.diagnosis !== null) {
          diagnosis = serviceData.activities.diagnosis;
        }
        if (typeof serviceData.activities.laboratory !== 'undefined' && serviceData.activities.laboratory !== null) {
          laboratory = serviceData.activities.laboratory;
        }
        if (typeof serviceData.activities.radiology !== 'undefined' && serviceData.activities.radiology !== null) {
          radiology = serviceData.activities.radiology;
        }
        if (typeof serviceData.activities.treatment !== 'undefined' && serviceData.activities.treatment !== null) {
          treatment = serviceData.activities.treatment;
        }
        if (typeof serviceData.activities.referout !== 'undefined') {
          if (serviceData.activities.referout !== null && serviceData.activities.referout.length > 0) {
            referout = serviceData.activities.referout[0];
          }
        }
      }
      // console.log(serviceData);
      // console.log(serviceData.activities.referout);
      // console.log(assessment);
    }

    // console.log(laboratory);
    if (currentView === 'tab') {
      return (
        <div style={{ width: 900 }}>
          {/* <Paper square> */}
          <div style={{ border: 'solid 1px #A0A0A0', borderRadius: 5, backgroundColor: '#F8F8F8' }}>
            <Tabs
              value={tabValue}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleTabChange}

              variant="scrollable"
              scrollButtons="on"
              aria-label="scrollable force tabs example"
            >
              {/* <Tab label="Service Information" /> */}
              <Tab label="Assessment" />
              <Tab label="Diagnosis" />
              <Tab label="Laboratory" />
              <Tab label="Radiology" />
              <Tab label="Treatment" />
              <Tab label="Refer Out" />
            </Tabs>
            {/* </Paper> */}
          </div>
          <div>
            <TabPanel value={tabValue} index={0}>
              {Object.keys(assessment).length > 0 && <BoxAssessment data={assessment} dataAll={assessmentListData} />}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {diagnosis.length > 0 && <BoxDiagnosis data={diagnosis} currentView={currentView} />}
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {laboratory.length > 0 && <BoxLaboratory data={laboratory} currentView={currentView} />}
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              {radiology.length > 0 && <BoxRadiology data={radiology} currentView={currentView} />}
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              {treatment.length > 0 && <BoxTreatment data={treatment} currentView={currentView} />}
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              {Object.keys(referout).length > 0 && <BoxReferout data={referout} />}
            </TabPanel>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>

          <div className={classes.boxHeadContain}>
            <div className={classes.boxHead}><b>Assessment</b></div>
            <div style={{ padding: 10 }}>
              {Object.keys(assessment).length > 0 && <BoxAssessment data={assessment} dataAll={assessmentListData} />}
            </div>
          </div>

          <div className={classes.boxHeadContain}>
            <div className={classes.boxHead}><b>Diagnosis</b></div>
            <div style={{ padding: 10 }}>
              {diagnosis.length > 0 && <BoxDiagnosis data={diagnosis} currentView={currentView} />}
            </div>
          </div>

          <div className={classes.boxHeadContain}>
            <div className={classes.boxHead}><b>Laboratory</b></div>
            <div style={{ padding: 10 }}>
              {laboratory.length > 0 && <BoxLaboratory data={laboratory} currentView={currentView} />}
            </div>
          </div>

          <div className={classes.boxHeadContain}>
            <div className={classes.boxHead}><b>Radiology</b></div>
            <div style={{ padding: 10 }}>
              {radiology.length > 0 && <BoxRadiology data={radiology} currentView={currentView} />}
            </div>
          </div>

          <div className={classes.boxHeadContain}>
            <div className={classes.boxHead}><b>Treatment</b></div>
            <div style={{ padding: 10 }}>
              {treatment.length > 0 && <BoxTreatment data={treatment} currentView={currentView} />}
            </div>
          </div>

          <div className={classes.boxHeadContain}>
            <div className={classes.boxHead}><b>Refer Out</b></div>
            <div style={{ padding: 10 }}>
              {Object.keys(referout).length > 0 && <BoxReferout data={referout} />}
            </div>
          </div>

        </div>
      );
    }
  }

  const extractData = () => {
    let hcodeDataTemp = [];
    let hcodeText = "";
    let extractedData = [];
    let c = 0;
    interventionData.forEach(i => {
      if (typeof i.activities != 'undefined') {
        if (typeof i.activities.assessment != 'undefined') {
          c++;
          if (c <= 10) {
            extractedData.push(i.activities.assessment[0]);
          }
        }
      }

      if (typeof i.vstdate != 'undefined') {
        if (hcodeText.indexOf(i.hcode) < 0) {
          hcodeText = hcodeText + "|" + i.hcode;
          hcodeDataTemp.push({ hcode: i.hcode, hos_name: i.hospital.hos_name });
        }
      }
    });
    setAssessmentListData(extractedData);
    setHcodeData(hcodeDataTemp);
  }

  const extractServiceInfo = () => {
    if (Object.keys(serviceData).length > 0) {
      let serviceInfo = {};
      serviceInfo['vstdate'] = serviceData['vstdate'];
      serviceInfo['vsttime'] = serviceData['vsttime'];
      serviceInfo['hcode'] = serviceData['hcode'];
      serviceInfo['hos_name'] = (typeof serviceData['hospital'] !== 'undefined' ? serviceData['hospital']['hos_name'] : '');
      serviceInfo['an'] = (typeof serviceData['an'] !== 'undefined' ? serviceData['an'] : '');
      serviceInfo['type_io'] = (typeof serviceData['an'] === 'undefined' ? 'OPD' : (serviceData['an'] === null || serviceData['an'] === '' ? 'OPD' : 'IPD'));
      serviceInfo['regdate'] = (typeof serviceData['regdate'] !== 'undefined' ? serviceData['regdate'] : '');
      serviceInfo['dchdate'] = (typeof serviceData['dchdate'] !== 'undefined' ? serviceData['dchdate'] : '');
      setServiceInfoData(serviceInfo);
    }
  }

  const hcodeList = () => {
    if (hcodeData.length > 0) {
      let hcodeElement = [];
      // console.log(hcodeData);
      hcodeData.forEach(i => {
        // console.log(i);
        hcodeElement.push(<option key={i.hcode} value={i.hcode}>{i.hcode} {i.hos_name}</option>);
      });
      return (
        <select style={{ width: '100%' }} onChange={changeHCode}>
          <option value={'all'}>
            ทั้งหมด
          </option>
          {hcodeElement}
        </select>
      );
    }
    else {
      return null;
    }
  }

  const changeHCode = (e) => {
    setSelectedHCode(e.target.value);
  }

  const clickChangeView = () => {
    let x = currentView;
    let v = (x === 'summary' ? 'tab' : 'summary');
    // console.log(v);
    setCurrentView(v);
  }

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // const getConsentSetting = async () => {
  //   let xParams = { filter: {where:{key: "emrRequiredConsent"}}};
  //   let response = await getAll(xParams, 'SystemSettings');
  //   if (response.status === 200) {
  //     if (response.data) {
  //       if (response.data.length > 0) {
  //         console.log(response.data[0].value);
  //         setNeedConsent(parseInt(response.data[0].value));
  //       }
  //     }
  //   }
  // }

  const closeBackdrop = () => {
    setOpenBackdrop(false);
  }

  const clearSearchCID = () => {
    setSearchCID(null);
    setSearchCIDValue('');
    setShowClearSearchCIDButton('none');
    setCidHelperText('');
    setSearchButtonDisabled(true);
  }

  const clearSearchPassport = () => {
    setSearchPassport(null);
    setSearchPassportValue('');
    setShowClearSearchPassportButton('none');
    setPassportHelperText('');
    setSearchButtonDisabled(true);
  }

  const clickSearchInput = () => {
    setSearchButtonDisabled(true);

    setSearchCID(null);
    setSearchCIDValue('');
    setShowClearSearchCIDButton('none');
    setCidHelperText('');

    setSearchPassport(null);
    setSearchPassportValue('');
    setShowClearSearchPassportButton('none');
    setPassportHelperText('');
  }

  const handleRequestEMR1HR = () => {
    // console.log('handleRequestEMR1HR');
    setOpenDialogEMR1hr(true);
  }

  const handleAcceptEMR1hr = async () => {
    // console.log('handleAcceptEMR1hr');
    setOpenBackdrop(true);
    let data = {
      temporaryAccessEMR: {
        minutes: 60,
        cid: searchCID,
        startDateTime: new Date()
      }
    };
    let response = await patch(currentUser.userId, data, 'teamusers');
    if (response.status === 200) {
      if (response.data) {
        logSave('request Temporary Access Without Consent --- CID:' + searchCID);
        getPersonInfo(searchCID);
        setOpenDialogEMR1hr(false);
        setOpenDialog(false);
        setOpenBackdrop(false);

        setEMR60mLeft(60);
        setDisplayEMR60mCountDown('block');
      }
    }
  }

  const handleCloseDialogEMR1hr = () => {
    // console.log('handleCloseDialogEMR1hr');
    setOpenDialogEMR1hr(false);
  }

  const countDown = () => {
    if (displayEMR60mCountDown === 'block') {
      if (EMR60mLeft > 0) {
        setTimeout(() => {
          setEMR60mLeft(EMR60mLeft - 1);
        }, 60000);
      } else {
        window.location.reload();
      }
    }
  }

  // useEffect(() => {
  //   console.log(currentUser.user);
  // }, []);

  useEffect(() => {
    countDown();
  }, [displayEMR60mCountDown, EMR60mLeft]);

  useEffect(() => {
    mkYearShow();
    extractData();
  }, [interventionData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    extractServiceInfo();
  }, [serviceData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let s = null;
    if (typeof props.history.location.state !== 'undefined') {
      s = props.history.location.state;
    }
    if (s) {
      setSearchCID(s.cid);
      handleClickSearch(null, s.cid);
    }
  }, [props.history.location]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ marginBottom: 100 }}>


      {/* <Backdrop className={classes.backdrop} open={openBackdrop} onClick={closeBackdrop}> */}
      <Backdrop className={classes.backdrop} open={openBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container justify="flex-start">
        <Grid item xs={12}>
          <Grid container justify="flex-end">
            <div style={{ display: displayEMR60mCountDown, color: 'red' }}>
              ระยะเวลาดูประวัติชั่วคราว {EMR60mLeft} นาที
            </div>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <div><h5>ค้นหาด้วยเลขบัตรประจำตัวประชาชน</h5></div>
          <TextField
            value={searchCIDValue}
            name="searchText"
            variant="outlined"
            style={{ width: '100%' }}
            onChange={(e) => onchangeSearchText(e)}
            helperText={cidHelperText}
            FormHelperTextProps={{ className: classes.helperText }}
            onClick={clickSearchInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start" style={{ cursor: 'pointer', marginTop: -20, display: showClearSearchCIDButton }} onClick={clearSearchCID}>
                  <MdClear />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={5}>
          <div><h5>ค้นหาด้วยเลข passport</h5></div>
          <TextField
            value={searchPassportValue}
            name="searchPassport"
            variant="outlined"
            style={{ width: '100%', marginLeft: 5 }}
            onChange={(e) => onchangeSearchPassport(e)}
            helperText={passportHelperText}
            FormHelperTextProps={{ className: classes.helperText }}
            onClick={clickSearchInput}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start" style={{ cursor: 'pointer', marginTop: -20, display: showClearSearchPassportButton }} onClick={clearSearchPassport}>
                  <MdClear />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={2} style={{ paddingLeft: 5 }}>
          <div><h5><br /></h5></div>
          <Button
            fullWidth
            onClick={(e) => handleClickSearch(e, null)}
            style={{ height: 55 }}
            variant="contained"
            color="primary"
            startIcon={<MdSearch size={20} />}
            disabled={searchButtonDisabled}
          >
            ค้นหา
          </Button>
        </Grid>
      </Grid>

      <div style={{ marginTop: 10, marginBottom: 10, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5, border: 'solid 1px #dadada' }}>
        <div style={{ display: 'flex', flexDirection: 'flex-start' }}>
          <div style={{ width: 200 }}>
            <div className={classes.contentTitle}>CID</div><div className={classes.contentText}>{patientData['cid']}</div>
          </div>
          <div style={{ width: 300 }}>
            <div className={classes.contentTitle}>ชื่อ-สกุล</div><div className={classes.contentText}>{patientData['pt_name']}</div>
          </div>
          <div style={{ width: 200 }}>
            <div className={classes.contentTitle}>วันเกิด</div><div className={classes.contentText}>{thaiXSDate(patientData['birthday'])}</div>
          </div>
          <div style={{ width: 150 }}>
            <div className={classes.contentTitle}>อายุ</div><div className={classes.contentText}>{patientData['age']}</div>
          </div>
          <div style={{ width: 'auto' }}>
            <div className={classes.contentTitle}>หมู่เลือด</div>
            <div className={classes.contentText} style={{ width: 50, overflow: 'hidden' }} >
              {patientData['bloodgrp']}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'flex-start' }}>
          <div>
            <div className={classes.contentTitle}>ที่อยู่</div><div className={classes.contentText}>{patientData['address_info']}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'flex-start' }}>
          <div>
            <div className={classes.contentTitle}>ประวัติแพ้ยา</div><div className={classes.contentText}>{patientData['drugallergy']}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'flex-start' }}>
          <div>
            <div className={classes.contentTitle}>ประวัติรับบริการนอกเขต 8</div><div className={classes.contentText}>{dataFromMoph}</div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: 250, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5, border: 'solid 1px #dadada' }}>
          {hcodeList()}
          {dateServList()}
        </div>
        <div style={{ width: '100%', padding: 10, borderRadius: 5, border: 'solid 1px #dadada', marginLeft: 10, whiteSpace: 'normal' }}>
          <div style={{ width: '100%', marginTop: -10, marginBottom: -10 }}>
            {/* <div style={{position: 'absolute', marginTop: -10}}> */}
            <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
              <div>
                {currentView !== 'tab' ? (
                  <Button
                    onClick={clickChangeView}
                    // style={{ width:30 }}
                    // variant="outlined"
                    color="primary"
                    startIcon={<MdSwapHoriz size={40} style={{ paddingLeft: 10 }} />}
                  />
                ) : (
                  <Button
                    onClick={clickChangeView}
                    // style={{ width:30 }}
                    // variant="outlined"
                    color="primary"
                    startIcon={<MdSwapVert size={40} style={{ paddingLeft: 10 }} />}
                  />
                )}
              </div>
              <div style={{ marginTop: 5, marginBottom: 20 }}>
                <Typography variant="h6" style={{ marginBottom: 5 }}>Service Information</Typography>
                {Object.keys(serviceInfoData).length > 0 && <BoxServiceInfo data={serviceInfoData} />}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 0 }}>
            {serviceDataBlock()}
          </div>
        </div>
      </div>

      <Dialog
        TransitionComponent={Transition}
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        {/* <DialogTitle id="alert-dialog-title">TEXT</DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component={'div'} style={{ marginTop: 20 }}>
            {dialogText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestEMR1HR} color="primary" variant={'contained'} style={{ display: displayEMR1hrButton }}>
            ขอดูประวัติชั่วคราว
          </Button>
          <Button onClick={handleCloseDialog} color="primary" variant={'contained'} autoFocus>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        TransitionComponent={Transition}
        open={openDialogEMR1hr}
        onClose={handleCloseDialogEMR1hr}
        fullWidth
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component={'div'} style={{ marginTop: 20 }}>
            <b>ขอดูประวัติชั่วคราว</b><br />
            คุณขอใช้สิทธิเข้าถึงประวัติการรับบริการของผู้ป่วยซึ่งไม่มีหลักฐานการยินยอม(Consent)เป็นการชั่วคราว ระบบจะบันทึกประวัติการขอใช้สิทธินี้ และคุณสามารถดูประวัติการรับบริการชั่วคราวได้ครั้งละ 1 ชั่วโมง
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAcceptEMR1hr} color="primary" variant={'contained'}>
            ตกลง
          </Button>
          <Button onClick={handleCloseDialogEMR1hr} color="primary" variant={'contained'} autoFocus>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}
