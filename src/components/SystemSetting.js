/* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from 'react';
import {
  makeStyles
} from '@material-ui/core/styles';
// npm install use-mediaquery --save

import useMediaQuery from '@material-ui/core/useMediaQuery';

import { getAll, patch } from "../services/UniversalAPI";
import LOG from "../services/SaveLog";

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


import { MdSearch, MdSwapHoriz, MdSwapVert } from 'react-icons/md';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  }
});


export default function SystemSetting(props) {
  const classes = useStyles();
  const [SSData, setSSData] = useState([]);
  const [selectSSData, setSelectSSData] = useState({});
  const [dialogText, setDialogText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const getSystemSettingData = async () => {
    let response = await getAll({}, 'SystemSettings');
    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          // console.log(response.data);
          setSSData(response.data);
        }
      }
    }
  }

  const changeSS = (e,i) => {
    let v=e.target.value;
    let x=selectSSData;
    x['value']=e.target.value;
    setSelectSSData({...selectSSData,...x});
  }

  const clickSS = (e,i) => {
    setSelectSSData(i);
  }

  const mkSelect = (i) => {
    let opt=[];
    let o=i.value_option;
    if (typeof o !== 'undefined') {
      if (o.length>0) {
        o.forEach(i => {
          opt.push(
            <option key={i.id} value={i.id}>{i.name}</option>
          );
        });
      }
    }
    return (
      <select defaultValue={i.value} onClick={(e)=>clickSS(e,i)} onChange={(e)=>changeSS(e,i)} style={{marginLeft:20}}>
        {opt}
      </select>
    );
  }

  const saveSS = async () => {
    let x=selectSSData;
    let response = await patch(x.id, x, 'SystemSettings');
    if (response.status === 200) {
      // if (response.data) {
        // if (response.data.length > 0) {
          // console.log(response.data);
        // }
      // }
      setDialogText('บันทึกเสร็จแล้ว');
      setOpenDialog(true);
    }
    else {
      setDialogText('เกิดข้อผิดพลาดระหว่างบันทึก');
      setOpenDialog(true);
    }
  }

  const clickSave = () => {
    // console.log('---',selectSSData);
    if (Object.keys(selectSSData).length > 0) {
      saveSS();
    }
  }

  const mkSSList = () => {
    let r=[];
    SSData.forEach(i => {
      r.push(
        <div key={i.id} style={{ display: 'flex', justifyContent:'space-between', padding: 10, border: 'solid 1px #E2E2E2', borderRadius: 7, marginTop: 10}}>
          <div style={{width: '100%'}}>
            {i.name}
          </div>
          <div>
            {i.value_type==='select' && mkSelect(i)}
          </div>
          <div>
            <Button
              onClick={(e) => clickSave(e, null)}
              style={{ height: 25, marginTop: -5, marginLeft:20 }}
              variant="contained"
              color="primary"
            >
              บันทึก
            </Button>
          </div>
        </div>
      );
    });
    return r;
  }

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    getSystemSettingData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  // }, [props.history.location]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ marginBottom: 100 }}>

      <div><h5>SYSTEM SETTING</h5></div>
      <div>
        {mkSSList()}
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
          <DialogContentText id="alert-dialog-description" component={'div'} style={{marginTop: 20}}>
            {dialogText}
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
