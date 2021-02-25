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

  const onchangeSearchText = (e) => {
    let v=e.target.value;
    let invalid=[];
    if (v.length!==13) {
      invalid.push('กรอกตัวเลขให้ครบ 13 หลัก');
    }
    if (!(/^[0-9]+$/.test(v))) {
      invalid.push('เฉพาะตัวเลขเท่านั้น');
    }

    if (invalid.length===0) {
      setSearchCID(v);
      setCidHelperText('');
    }
    else {
      setSearchCID(null);
      setCidHelperText(invalid.join(', '));
    }
  }

  const handleClickSearch = async (e,cid) => {
    let c=null;
    if (cid===null) {
      c=searchCID
    }
    else {
      c=cid;
    }
    if (typeof c !=='undefined') {
      if (c !== null) {
      setPatientData([]);
      setinterventionData([]);
      setServiceData({});
      setYearShow({});
      setAssessmentListData([]);
      setHcodeData({});
      setServiceInfoData({});
      getPersonInfo(c);
      }
    }
  }

  const getPersonInfo = async (cid) => {
    let c=null;
    if (searchCID) {
      c=searchCID;
    }
    else {
      c=cid;
    }
    setPatientData([]);
    setinterventionData([]);
    setServiceData({});
    let xParams = {
      filter: {
        where: {cid:c},
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
    let response = await UAPI.getAll(xParams, 'people');
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length>0) {
          console.log(response.data);
          let r=response.data[0];
          // console.log(r);
          let x=[];
          x['cid']=r['cid'];
          x['pt_name']=r['fname']+' '+r['lname'];
          x['birthday']=r['birthday'];
          x['age']=calcAge(r['birthday']);
          x['bloodgrp']=r['bloodgrp'];
          // x['address_info']='';
          x['address_info']=r['informaddr'];
          x['drugallergy']=(r['drugallergy']!==''?r['drugallergy']:'ไม่พบข้อมูลการแพ้ยา');
          setPatientData(x);
          let intervention=r.intervention;
          if (typeof intervention != 'undefined') {
            if (intervention.length>0) {
              intervention.reverse();
              setinterventionData(intervention);   
              let s=null;
              if (typeof props.history.location.state !== 'undefined') {
                s=props.history.location.state;
              }
              if (s) {
                intervention.forEach(i => {
                  // if (i.date===d) {
                  if (i.hcode===s.hcode && i.vn===s.vn) {
                    x=i;
                  }
                });
                setServiceData(x);
              }
            }
          }
        }
        else {
          setOpenDialog(true);
        }
      }
    }
  }

  const mkYearShow = () => {
    let yearShowTemp={};
    let lastYear='';
    let n=0;
    interventionData.forEach(i => {
      if (typeof i.date != 'undefined') {
        n++;
        let x=(parseInt(i.date.substr(0,4))+543).toString();
        yearShowTemp[x]='none';
        if (n===1) {
          lastYear=x;
        }
      }
    });
    yearShowTemp[lastYear]='block';
    setYearShow(yearShowTemp);
  }

  const dateServList = () => {
    if (interventionData.length>0) {
      let yearsData=[];
      interventionData.forEach(i => {
        let service_date = i.date;
        if (typeof service_date === 'undefined') {
          service_date = i.vstdate;
        }
        if (typeof service_date === 'undefined') {
          service_date = i.dchdate;
        }
        if (typeof service_date != 'undefined') {
        // if (typeof i.hcode != 'undefined' && typeof i.vn != 'undefined') {
          // if (i.date==='2018-03-30') {
          //   console.log(i);
          // }
          let x=(parseInt(service_date.substr(0,4))+543).toString();
          // let x=i.hcode+'_'+i.vn;
          if (typeof yearsData[x] === 'undefined') {
            // console.log('ไม่มี-------',x);
            yearsData[x]=[];
            yearsData[x].push({hcode: i.hcode, vn: i.vn, date:service_date,hos_name:i.hospital.hos_name});
          }
          else {
            // console.log('มี-------',x);
            yearsData[x].push({hcode: i.hcode, vn: i.vn, date:service_date,hos_name:i.hospital.hos_name});
          }
        }
      });

// console.log(yearsData);

      let yearList=[];
      yearsData.reverse();
      yearsData.forEach(y => {
        let dateList=[];
        let yearTitle="";
        let dateCount=y.length;
        let i=0;
        // console.log(y);
        y.forEach(d => {
          // console.log(d);
          i++;
          yearTitle=(parseInt(d.date.substr(0,4))+543).toString();
          // if (yearTitle==='2561') {
          //   console.log(d);
          // }
          dateList.push(
            <Tooltip title={<span style={{fontSize: 16}}>{d.hos_name} ({d.hcode})</span>} arrow={true} placement="right" key={d.date.toString()+'_'+i} >
              <div 
                className={classes.linkDateServ} 
                onClick={(e)=>selectDateServ(e,d.date,d.hcode,d.vn)} 
                style={{ width: '100%', height: 25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2, borderRadius: 10, paddingLeft: 5 }}
              >
                {thaiXSDate(d.date)} {d.hos_name}
              </div>
            </Tooltip>
          );
        });
        yearList.push(
          <div key={yearTitle}>
            <div 
              style={{fontWeight:'bold', cursor: 'pointer', backgroundColor: '#e2e2e2', borderRadius: 10, marginTop: 5, paddingLeft: 10}} 
              onClick={()=>toggleYear(yearTitle)}
            >
              พ.ศ. {yearTitle} ({dateCount})
            </div>
            <div style={{display: yearShow[yearTitle]}}>
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
    let a=yearShow;
    let o=a[x];
    a[x]=(o==='none'?'block':'none');
    setYearShow({...yearShow,...a}); 
  }

  const selectDateServ = (e,d,hcode,vn) => {
    let x={};
    interventionData.forEach(i => {
      // if (i.date===d) {
      if (i.hcode===hcode && i.vn===vn) {
        x=i;
      }
    });
    setServiceData(x);
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const serviceDataBlock = () => {
// console.log(currentView);
    let assessment={};
    let diagnosis=[];
    let treatment=[];
    let laboratory=[];
    let radiology=[];
    let referout=[];
    let type_io='OPD';
    let an='';
    if (Object.keys(serviceData).length>0) {
      if (typeof serviceData.an !== 'undefined') {
        // if (serviceData.an !== null && serviceData.an !== '') {
          type_io='IPD';
          an=serviceData.an;
        // }
      }
      if (serviceData.activities) {
        // console.log(serviceData.activities.assessment);
        if (typeof serviceData.activities.assessment !== 'undefined') {
          if (serviceData.activities.assessment !== null && serviceData.activities.assessment.length>0) {
            assessment=serviceData.activities.assessment[0];
          }
        }
        if (typeof serviceData.activities.diagnosis !== 'undefined' && serviceData.activities.diagnosis !== null) {
          diagnosis=serviceData.activities.diagnosis;
        }
        if (typeof serviceData.activities.laboratory !== 'undefined' && serviceData.activities.laboratory !== null) {
          laboratory=serviceData.activities.laboratory;
        }
        if (typeof serviceData.activities.radiology !== 'undefined' && serviceData.activities.radiology !== null) {
          radiology=serviceData.activities.radiology;
        }
        if (typeof serviceData.activities.treatment !== 'undefined' && serviceData.activities.treatment !== null) {
          treatment=serviceData.activities.treatment;
        }
        if (typeof serviceData.activities.referout !== 'undefined') {
          if (serviceData.activities.referout !== null && serviceData.activities.referout.length>0) {
            referout=serviceData.activities.referout[0];
          }
        }
      }
      // console.log(serviceData);
      // console.log(serviceData.activities.referout);
      // console.log(assessment);
    }

    if (currentView==='tab') {
      return (
        <div style={{ width: 900}}>
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
              {Object.keys(assessment).length>0 && <BoxAssessment data={assessment} dataAll={assessmentListData} /> }
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              {diagnosis.length>0 && <BoxDiagnosis data={diagnosis} /> }
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              {laboratory.length>0 && <BoxLaboratory data={laboratory} /> }
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              {radiology.length>0 && <BoxRadiology data={radiology} /> }
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              {treatment.length>0 && <BoxTreatment data={treatment} type_io={type_io} /> }
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              {Object.keys(referout).length>0 && <BoxReferout data={referout} />}
            </TabPanel>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <div style={{marginTop: 10, marginBottom: 10, paddingTop: 10, borderTop: 'solid 1px #E0E0E0'}}><b>Assessment</b></div>
          {Object.keys(assessment).length>0 && <BoxAssessment data={assessment} dataAll={assessmentListData} /> }

          <div style={{marginTop: 10, marginBottom: 10, paddingTop: 10, borderTop: 'solid 1px #E0E0E0'}}><b>Diagnosis</b></div>
          {diagnosis.length>0 && <BoxDiagnosis data={diagnosis} /> }

          <div style={{marginTop: 10, marginBottom: 10, paddingTop: 10, borderTop: 'solid 1px #E0E0E0'}}><b>Laboratory</b></div>
          {laboratory.length>0 && <BoxLaboratory data={laboratory} /> }

          <div style={{marginTop: 10, marginBottom: 10, paddingTop: 10, borderTop: 'solid 1px #E0E0E0'}}><b>Radiology</b></div>
          {radiology.length>0 && <BoxRadiology data={radiology} /> }

          <div style={{marginTop: 10, marginBottom: 10, paddingTop: 10, borderTop: 'solid 1px #E0E0E0'}}><b>Treatment</b></div>
          {treatment.length>0 && <BoxTreatment data={treatment} type_io={type_io} /> }

          <div style={{marginTop: 10, marginBottom: 10, paddingTop: 10, borderTop: 'solid 1px #E0E0E0'}}><b>Refer Out</b></div>
          {Object.keys(referout).length>0 && <BoxReferout data={referout} />}
        </div>
      );
    }
  }

  const extractData = () => {
    let hcodeDataTemp=[];
    let hcodeText="";
    let extractedData=[];
    let c=0;
    interventionData.forEach(i => {
      if (typeof i.activities != 'undefined') {
        if (typeof i.activities.assessment != 'undefined') {
          c++;
          if (c<=10) {
            extractedData.push(i.activities.assessment[0]);
          }
        }
      }

      if (typeof i.date != 'undefined') {
        if (hcodeText.indexOf(i.hcode)<0) {
          hcodeText=hcodeText+"|"+i.hcode;
          hcodeDataTemp.push({hcode: i.hcode, hos_name:i.hospital.hos_name});
        }
      }
    });
    setAssessmentListData(extractedData);
    setHcodeData(hcodeDataTemp);
  }

  const extractServiceInfo = () => {
    if (Object.keys(serviceData).length>0) {
      // console.log(serviceData);
      let service_date=serviceData.date;
      if (typeof service_date === 'undefined') {
        service_date = serviceData.vstdate;
      }
      if (typeof service_date === 'undefined') {
        service_date = serviceData.dchdate;
      }
      let serviceInfo={};
      // serviceInfo['date']=serviceData['date'];
      serviceInfo['date']=service_date;
      serviceInfo['vsttime']=serviceData['vsttime'];
      serviceInfo['hcode']=serviceData['hcode'];
      if (typeof serviceData['hospital'] !== 'undefined') {
        serviceInfo['hos_name']=serviceData['hospital']['hos_name'];
      }
      else {
        serviceInfo['hos_name']='';
      }
      // serviceInfo['hos_name']='';
      setServiceInfoData(serviceInfo);
    }
  }

  const hcodeList = () => {
    if (hcodeData.length>0) {
      let hcodeElement=[];
      // console.log(hcodeData);
      hcodeData.forEach(i => {
        // console.log(i);
        hcodeElement.push(<option key={i.hcode} value={i.hcode}>{i.hcode} {i.hos_name}</option>);
      });
      return (
        <select style={{width: '100%'}} onChange={changeHCode}>
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
    console.log('changeHCode------------',e.target.value);
    // interventionData
  }

  const clickChangeView = () => {
    // console.log('clickChangeView------', currentView);
    let x=currentView;
    let v=(x==='summary'?'tab':'summary');
    setCurrentView(v);
  }

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    mkYearShow();
    extractData();
  }, [interventionData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    extractServiceInfo();
  }, [serviceData]); // eslint-disable-line react-hooks/exhaustive-deps
  
  useEffect(() => {
    let s=null;
    if (typeof props.history.location.state !== 'undefined') {
      s=props.history.location.state;
    }
    if (s) {
      setSearchCID(s.cid);
      handleClickSearch(null,s.cid);
    }
  }, [props.history.location]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{marginBottom:100}}>

      <div><h5>ค้นหาด้วยเลขบัตรประจำตัวประชาชน</h5></div>
      <div style={{ width: '100%' ,display:'flex' ,justifyContent:'space-between' }}>
        <div style={{width:'100%'}}>
          <TextField
            name="searchText"
            variant="outlined"
            // placeholder="ค้นหา"
            style={{ width: '100%' }}
            onChange={(e) => onchangeSearchText(e)}
            helperText={cidHelperText}
            FormHelperTextProps={{ className: classes.helperText }}
            // startAdornment={
            //   <InputAdornment position="start">
            //     <MdSearch size={20} />
            //   </InputAdornment>
            // }
          />
        </div>
        <div>
          <Button
            onClick={(e)=>handleClickSearch(e,null)}
            style={{height:55}}
            variant="contained"
            color="primary"
            startIcon={<MdSearch size={20} />}
          >
            ค้นหา
          </Button>
        </div>
      </div>

      <div style={{marginTop: 10, marginBottom: 10, padding:10, backgroundColor: '#f9f9f9', borderRadius: 5, border:'solid 1px #dadada' }}>
        <div style={{display:'flex', flexDirection:'flex-start'}}>
          <div style={{width:200}}>
            <div className={classes.contentTitle}>CID</div><div className={classes.contentText}>{patientData['cid']}</div>
          </div>
          <div style={{width:300}}>
            <div className={classes.contentTitle}>ชื่อ-สกุล</div><div className={classes.contentText}>{patientData['pt_name']}</div>
          </div>
          <div style={{width:200}}>
            <div className={classes.contentTitle}>วันเกิด</div><div className={classes.contentText}>{thaiXSDate(patientData['birthday'])}</div>
          </div>
          <div style={{width:150}}>
            <div className={classes.contentTitle}>อายุ</div><div className={classes.contentText}>{patientData['age']}</div>
          </div>
          <div style={{width:'auto'}}>
            <div className={classes.contentTitle}>หมู่เลือด</div>
            <div className={classes.contentText} style={{ width: 50, overflow:'hidden'}} >
              {patientData['bloodgrp']}
            </div>
          </div>
        </div>
        <div style={{display:'flex', flexDirection:'flex-start'}}>
          <div>
            <div className={classes.contentTitle}>ที่อยู่</div><div className={classes.contentText}>{patientData['address_info']}</div>
          </div>
        </div>
        <div style={{display:'flex', flexDirection:'flex-start'}}>
          <div>
            <div className={classes.contentTitle}>ประวัติแพ้ยา</div><div className={classes.contentText}>{patientData['drugallergy']}</div>
          </div>
        </div>
      </div>
      
      <div style={{ width: '100%' ,display:'flex' ,justifyContent:'space-between' }}>
        <div style={{ width:250, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5, border:'solid 1px #dadada'}}>
          {hcodeList()}
          {dateServList()}
        </div>
        <div style={{ width:'100%', padding: 10, borderRadius: 5, border:'solid 1px #dadada', marginLeft: 10 ,whiteSpace: 'normal'}}>
          <div style={{ width: '100%', marginTop: -10, marginBottom: -10 }}>
            {/* <div style={{position: 'absolute', marginTop: -10}}> */}
            <div style={{display:'flex', flexDirection:'row-reverse', justifyContent: 'space-between'}}>
              <div>
                {currentView!=='tab'?(
                  <Button
                    onClick={clickChangeView}
                    // style={{ width:30 }}
                    // variant="outlined"
                    color="primary"
                    startIcon={<MdSwapHoriz size={40} style={{ paddingLeft: 10 }} />}
                  />
                ):(
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
                {Object.keys(serviceInfoData).length>0 && <BoxServiceInfo data={serviceInfoData} />}
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
        <DialogTitle id="alert-dialog-title">ผลการค้นหา</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ไม่พบข้อมูลของ CID นี้
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant={'contained'} autoFocus>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}
