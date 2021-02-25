/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import styled from "styled-components";
import {
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Button as MuiButton,
  Card as MuiCard,
  Typography
} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { spacing } from "@material-ui/system";
import AssignmentIcon from '@material-ui/icons/Assignment';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/Info';
import { indigo } from '@material-ui/core/colors';
import moment from "moment";
import UAPI from "../services/UniversalAPI";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import axios, { post } from 'axios';
const useStyles = makeStyles(theme => ({
  card:{
    '& .MuiInputLabel-outlined': {
      zIndex: 1,
      transform: 'translate(15px, 12px) scale(1)',
      pointerEvents: 'none'
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(15px, -16px) scale(0.75)',
    },
    'border': 'solid 1px rgba(0, 0, 0, 0.12)',
    'box-shadow': 'none',
    'margin-top': '20px'
  },
  indigoButton: {
    backgroundColor: indigo[500],
    color: '#FFF',
    '&:hover': {
        backgroundColor: `${indigo[400]} !important`,
        color: '#FFF'
    }
  },
  error : {
    color:'#da0000'
  },
  success : {
    color:'#000'
  },
  display:{
    display:'block'
  },
  hide:{
    display:'none'
  }
}));
const Card = styled(MuiCard)(spacing);
const Button = styled(MuiButton)(spacing);
const Assignment = styled(AssignmentIcon)(spacing);
function ConsentArea() {
  const classes = useStyles();
  const [cid, setCid] = useState('');
  const [person, setPerson] = useState('');
  const [consentFile, setConsentFile] = useState('');
  const [filename, setFilename] = useState('');
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const alertOpen = () => {setOpen(true);};
  const alertClose = () => {setOpen(false);};
  const [alertText, setAlertText] = useState('');
  const [alertClass,setAlertClass] = useState('error');

  const handleInputChange = (e, validate) => {
    let name = e.target.name;
    let value = e.target.value;
    switch (name) {
      case 'cid': setCid(value); break;
      case 'consent': 
        let filename = (typeof e.target.files[0] !=='undefined')?e.target.files[0].name:'';
        setConsentFile(e.target.files[0]); 
        setFilename("( "+filename+" )");
        break;
      default : break;
    }
  }
  const handleSearch = async() =>{
    if(cid !== ''){
      let searchPerson = await UAPI.getAll({ filter: { "fields": { "cid": "true","id": "true","prename":"true","fname": "true","lname": "true","hcode":"true" }, "where": { "cid": cid },"include":"consent", "limit":"1"} }, 'people');
      if(typeof searchPerson.data[0] !== 'undefined' && searchPerson.data[0] !=='' && searchPerson.data[0] != null){
        if(typeof searchPerson.data[0].consent !=='undefined'){
          let token = JSON.parse(localStorage.getItem("EW30")).id;
          let consentPath = process.env.REACT_APP_API_URL+'containers/consentForm/download/'+searchPerson.data[0].consent.fileConsent+'?access_token=token'+token;
          searchPerson.data[0].consent.consentPath=consentPath;
        }
        setPerson(searchPerson.data[0]);
      }else{
        setPerson('ไม่พบข้อมูลผู้ป่วย');
      }
    }
  }
  const handleSubmit = async(e) => {
    const userinfo=JSON.parse(localStorage.getItem("EW30"));
    if(typeof person.id !== 'undefined'){ // มีข้อมูลผู้ป่วยที่ได้จากการค้น
      if(typeof consentFile !=='undefined' && consentFile !==''){ // มีไฟล์อัพโหลดที่ browse เข้ามา
        let extension = consentFile.type.replace('///g', '');
        switch (extension){
          case 'image/jpeg':extension='jpg';break;
          case 'image/png':extension='png';break;
          case 'application/pdf':extension='pdf';break;
          default:extension=''
        }
        if(extension!==''){
          const newFile = new File([consentFile], `${person.id}.${extension}`, { type: consentFile.type });
          console.log(newFile);
          const formData = new FormData();
          formData.append('container','consentForm');
          formData.append('file',newFile);
          let uploadResult = await UAPI.uploadFile(formData, 'containers/consentForm/upload'); // อัพโหลดผ่าน loopback
          // let uploadResult={status:false};
          if(uploadResult.status===200){ // อัพโหลดไฟล์สำเร็จ
            const consentData = {
              "cid":cid,
              "personId": person.id,
              "fileConsent": newFile.name,
              "statusConsent": "Y",
              "consentDate": moment().format("YYYY-MM-DD HH:mm:ss"),
              "recorderId":userinfo.user.id
            };
            let consentResult = await UAPI.create(consentData, 'consents'); // บันทึกข้อมูล consent
            // let consentResult={status:false};
            if(consentResult.status===200){
              // บันทึกข้อมูล consent สำเร็จ แล้วเครียร์ข้อมูลใน state
              setCid('');
              setPerson('');
              setConsentFile('');
              setFilename('');
              setAlertClass('success');
              setAlertText('ยืนยันการเปิดเผยข้อมูลสำเร็จ');
              alertOpen();
            }else{
              console.log(consentResult);
            }
          }else{
            console.log(uploadResult);
          }
        }else{
          setAlertClass('error');
          setAlertText('รองรับไฟล์ jpg, png, pdf เท่านั้น');
          alertOpen();
        }
      }else{
        setAlertClass('error');
        setAlertText('กรุณาเลือกไฟล์ก่อน');
        alertOpen();
      }
    }else{
      setAlertText('กรุณาค้นหาผู้ป่วยก่อน');
      setAlertClass('error');
      alertOpen();
    }

  }
  return (
    <Card mb={6} className={classes.card}>
      <CardContent style={{padding: '30px 30px 0 30px'}}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} >
            <Typography component="p">ค้นหาผู้ป่วย</Typography>
          </Grid>
          <Grid item xs={12} md={11} >
            <TextField
              id="cid"
              name="cid"
              label="หมายเลขบัตรประจำตัวประชาชน"
              type="text"
              size="medium"
              variant="outlined"
              fullWidth 
              value={cid}
              onChange={event => handleInputChange(event, ['required', 'length'])}
              onKeyPress={event => event.key === 'Enter' && handleSearch()}
              required
            />
          </Grid>
          <Grid item xs={12} md={1} style={{display: 'flex'}}>
            <IconButton color="primary" aria-label="search" style={{width: '100%'}} onClick={(e) => handleSearch(e)}><SearchIcon /></IconButton >
          </Grid>
          <Grid item xs={12} md={12} >
            {(typeof person.id!=='undefined')?(
              <div>
                <div>
                  ชื่อ - สกุล : {(person.prename||'')+person.fname+" "+person.lname}
                </div>
                <div>
                  รหัสสถานบริการ : {person.hcode}
                </div>
                <div className={(typeof person.consent!=='undefined')?classes.display:classes.hide}>
                  แบบฟอร์มยืนยัน : { 
                    (typeof person.consent !=='undefined')
                    ? <a href={person.consent.consentPath} target="_blank" rel="noopener noreferrer">ดูแบบฟอร์ม</a>
                    :''
                  }
                </div>
              </div>
            ):(<div>{person}</div>)}
            <Dialog
              maxWidth="xl"
              open={open}
              onClose={alertClose}
              aria-labelledby="submitAlert"
            >
              <DialogTitle id="submitAlert"><InfoIcon className={ (alertClass==='error')?classes.error:classes.success }/></DialogTitle>
              <DialogContent>
                <DialogContentText style={{width: '300px',textAlign:'center'}} className={ (alertClass==='error')?classes.error:classes.success }>{alertText}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={alertClose} color="primary" autoFocus>ปิด</Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid item xs={12} md={12} className={(typeof person.consent!=='undefined')?classes.hide:classes.display}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="consent"
              name="consent"
              multiple
              type="file"
              onChange={(e) => handleInputChange(e, ['required', 'length'])}
            />
            <label htmlFor="consent">
              <Button variant="outlined" color="primary" component="span" style={{'marginLeft':'unset','padding': '10px 16px'}}><Assignment mr={2} /> เลือกไฟล์</Button> {filename}
              <Typography variant="caption" display="block" gutterBottom style={{marginTop: '10px'}}>
                ภาพถ่ายแบบฟอร์มยืนยันการเปิดเผยข้อมูล ไฟล์ jpg, png, pdf
              </Typography>
            </label>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions style={{padding: '0 30px 30px 30px'}}>
        <Grid container style={{justifyContent: 'flex-end'}} className={(typeof person.consent!=='undefined')?classes.hide:''}>
          <Grid item xs={12} md={2} >
            <Button 
              className={classes.indigoButton} 
              fullWidth 
              style={{'marginLeft':'unset','padding': '10px 16px'}}
              onClick={(e) => handleSubmit(e)}
            >
                ยืนยัน
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

const Consent = () => {
  return (
    <div className="container">
      <Typography variant="h4" gutterBottom display="inline">ยืนยันการเปิดเผยข้อมูล</Typography>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <ConsentArea />
        </Grid>
      </Grid>
    </div>
  );
};

export default Consent;