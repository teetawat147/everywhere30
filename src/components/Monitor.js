/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Backdrop,
  Grid,
} from "@material-ui/core";
// import { Pagination } from '@material-ui/lab';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { getAll } from "../services/UniversalAPI";
import { getCurrentUser } from "../services/auth.service";
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  table: {
    // minWidth: 700,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    '& .MuiInputLabel-outlined': {
      zIndex: 1,
      transform: 'translate(15px, 4px) scale(1)',
      pointerEvents: 'none'
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(15px, -16px) scale(0.75)',
    }
  },
  ct: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    boxSizing: 'border-box'
  }
}));
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#2d2d37',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const Monitor = () => {
  const classes = useStyles();
  const width = useWidth();
  const [rows, setRows] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const currentUser = getCurrentUser();
  const [changwats, setChangwats] = useState([]);
  const [changwat, setChangwat] = useState((currentUser != null) ? currentUser.user.changwat : '');
  const [hostype, setHostype] = useState('hospital');
  const rowsPerpage = 7;
  // const [allPages, setAllPages] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  useEffect(() => {
    // setOpenBackdrop(true);
    const getChangwat = async () => {
      let xParams = {
        filter: {
          fields: { changwatcode: true, changwatname: true },
          where: { "zonecode": "08" }
        }
      };
      let response = await getAll(xParams, 'cchangwats');
      if (response.status === 200) {
        if (response.data) {
          if (response.data.length > 0) {
            setChangwats(response.data);
          }
        }
      }
    }
    getChangwat();
    getData(currPage, rowsPerpage).then((result) => {
      if (Object.keys(result).length > 0) {
        MakeRows(result);
      } else {
        setOpenBackdrop(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getData(currPage, rowsPerpage).then((result) => {
      if (Object.keys(result).length > 0) {
        MakeRows(result);
      } else {
        setOpenBackdrop(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changwat, hostype]);

  const getData = async (page, rowPerpage) => {
    setOpenBackdrop(true);
    let params = {
      filter: {
        fields: { hos_id: true, hos_name: true },
        where: {},
        counts: "person",
        // limit: rowPerpage,
        // skip: rowPerpage * (page - 1)
      }
    };
    let hostype_id = [];
    if (typeof hostype !== 'undefined' && hostype != null && hostype !== '') {
      switch (hostype) {
        case 'hospital': hostype_id = [{ hos_type_id: '2' }, { hos_type_id: '3' }, { hos_type_id: '4' }];
          break;
        case 'subHospital': hostype_id = [{ hos_type_id: '6' }];
          break;
        default: hostype_id = [{ hos_type_id: '2' }, { hos_type_id: '3' }, { hos_type_id: '4' }, { hos_type_id: '6' }];
          break;
      }
    }
    let response = null;
    if (typeof changwat !== 'undefined' && changwat != null && changwat !== '') {
      params.filter.where = {
        province_name: changwat,
        or: hostype_id
      };
      response = await getAll(params, 'hospitals');
    }
    // console.log(JSON.stringify(params));
    let result = [];
    if (response != null) {
      if (response.status === 200) {
        if (response.data) {
          if (response.data.length > 0) {
            result = await response.data.map(async (hos) => {
              let [hosname] = hos.hos_name.split(/\s+(.*)/);
              return {
                hcode: hos.hos_id,
                hosname: hosname,
                count: hos.personCount
              };
            });
          }
        }
      }
    }
    return await Promise.all(result);
  }
  const MakeRows = (hospitals) => {
    let row = [];
    let total_person = 0;
    let key = 0;
    hospitals.map((hos) => {
      total_person += hos.count;
      row.push(<StyledTableRow key={key++}>
        <TableCell align="center">{hos.hcode}</TableCell>
        <TableCell component="th" scope="row">{hos.hosname}</TableCell>
        <TableCell align="right">{typeof total_person !== "undefined" ? hos.count.toLocaleString() : hos.count}</TableCell>
      </StyledTableRow>);
    });
    row.push(
      <StyledTableRow key="total">
        <TableCell align="center"></TableCell>
        <TableCell component="th" scope="row"><b>รวมทั้งสิ้น</b></TableCell>
        <TableCell align="right"><b>{typeof total_person !== "undefined" ? total_person.toLocaleString() : total_person}</b></TableCell>
      </StyledTableRow>
    );
    setRows(row);
    setOpenBackdrop(false);
  }
  // const totalPage = (totalCount) => {
  //   setAllPages(parseInt(Math.ceil(parseInt(totalCount) / parseInt(rowsPerpage))));
  // }
  // const onClickPage = (e, page) => {
  //   e.preventDefault();
  //   getData(page, rowsPerpage).then((result) => {
  //     if (Object.keys(result).length > 0) {
  //       MakeRows(result);
  //       setCurrPage(page);
  //     }
  //   });
  // }
  return (
    <div className={classes.root} style={{ marginBottom: 100, width: '100%', maxWidth: "100%" }}>
      <Grid>
        <Grid item xs={12}>
          <Backdrop className={classes.backdrop} open={openBackdrop}><CircularProgress color="inherit" /></Backdrop>
          <div style={{ marginBottom: '30px' }}><h4>Monitor Person Data</h4></div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={2} lg={2}>
              <FormControl variant="outlined" size="small" className={classes.formControl} style={{ margin: '0', width: '100%' }}>
                <InputLabel htmlFor="changwat">จังหวัด</InputLabel>
                <Select
                  label="จังหวัด"
                  value={changwat}
                  onChange={(e) => {
                    // setCurrPage(1);
                    // setAllPages(0);
                    setChangwat(e.target.value);
                  }}
                  inputProps={{
                    name: 'changwat',
                    id: 'changwat',
                  }}
                >
                  {/* <MenuItem key="0" value="">กรุณาเลือกจังหวัด</MenuItem> */}
                  {changwats.map((chw, key) => {
                    return <MenuItem key={key++} value={chw.changwatname}>{chw.changwatname}</MenuItem>;
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <FormControl variant="outlined" size="small" style={(['xs', 'sm'].includes(width)) ? { margin: '10px 0 0 0', width: '100%' } : { margin: '0', width: '100%' }} className={classes.formControl} >
                <InputLabel htmlFor="changwat">ประเภทหน่วยงาน</InputLabel>
                <Select
                  label="ประเภทหน่วยงาน"
                  value={hostype}
                  onChange={(e) => {
                    // setCurrPage(1);
                    // setAllPages(0);
                    setHostype(e.target.value);
                  }}
                  inputProps={{
                    name: 'hostype',
                    id: 'hostype',
                  }}
                >
                  <MenuItem key="hospital" value="hospital">โรงพยาบาล</MenuItem>
                  <MenuItem key="subHospital" value="subHospital">โรงพยาบาลส่งเสริมสุขภาพตำบล</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center"><b>รหัสหน่วยบริการ</b></StyledTableCell>
                      <StyledTableCell align="center"><b>หน่วยบริการ</b></StyledTableCell>
                      <StyledTableCell align="center"><b>จำนวน</b></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(Object.keys(rows).length > 0) && rows}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Monitor;
