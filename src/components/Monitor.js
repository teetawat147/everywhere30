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
  Backdrop
} from "@material-ui/core";
import { Pagination } from '@material-ui/lab';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { getAll, getCount, countPerson } from "../services/UniversalAPI";
import { getCurrentUser } from "../services/auth.service";
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  table: {
    minWidth: 700,
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
  const [rows, setRows] = useState({});
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const currentUser = getCurrentUser();
  const [changwats, setChangwats] = useState([]);
  const [changwat, setChangwat] = useState(currentUser.user.changwat);
  const [hostype, setHostype] = useState('hospital');
  const rowsPerpage = 7;
  const [allPages, setAllPages] = useState(0);
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
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getData(currPage, rowsPerpage).then((result) => {
      if (Object.keys(result).length > 0) {
        MakeRows(result);
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
    if (typeof changwat !== 'undefined' && changwat != null && changwat !== '') {
      params.filter.where = {
        province_name: changwat,
        or: hostype_id
      };
    }
    // console.log(JSON.stringify(params));
    let result = [];
    let response = await getAll(params, 'hospitals');
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
    return await Promise.all(result);
  }
  const MakeRows = (hospitals) => {
    let row = [];
    let total_person = 0;
    let key = 0;
    hospitals.map((hos) => {
      total_person += hos.count;
      row.push(<TableRow key={key++}>
        <TableCell align="center">{hos.hcode}</TableCell>
        <TableCell component="th" scope="row">{hos.hosname}</TableCell>
        <TableCell align="right">{hos.count}</TableCell>
      </TableRow>);
    });
    row.push(
      <TableRow key="total">
        <TableCell align="center"></TableCell>
        <TableCell component="th" scope="row">รวมทั้งสิ้น</TableCell>
        <TableCell align="right">{total_person}</TableCell>
      </TableRow>
    );
    setRows(row);
    setOpenBackdrop(false);
  }
  const totalPage = (totalCount) => {
    setAllPages(parseInt(Math.ceil(parseInt(totalCount) / parseInt(rowsPerpage))));
  }
  const onClickPage = (e, page) => {
    e.preventDefault();
    getData(page, rowsPerpage).then((result) => {
      if (Object.keys(result).length > 0) {
        MakeRows(result);
        setCurrPage(page);
      }
    });
  }
  return (
    <div className={classes.root} style={{ marginBottom: 100, width: '100%' }}>
      <Backdrop className={classes.backdrop} open={openBackdrop}><CircularProgress color="inherit" /></Backdrop>
      <div style={{ marginBottom: '30px' }}><h4>Monitor Person Data</h4></div>
      <FormControl variant="outlined" size="small" className={classes.formControl} style={{ margin: '0' }}>
        <InputLabel htmlFor="changwat">จังหวัด</InputLabel>
        <Select
          label="จังหวัด"
          value={changwat}
          onChange={(e) => {
            setCurrPage(1);
            setAllPages(0);
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
      <FormControl variant="outlined" size="small" style={{ width: '30%', margin: '0 0 0 8px' }} className={classes.formControl} >
        <InputLabel htmlFor="changwat">ประเภทหน่วยงาน</InputLabel>
        <Select
          label="ประเภทหน่วยงาน"
          value={hostype}
          onChange={(e) => {
            setCurrPage(1);
            setAllPages(0);
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
      {/* <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Pagination count={allPages} page={currPage} onChange={onClickPage} color="primary" />
      </div> */}
    </div>
  );
};

export default Monitor;
