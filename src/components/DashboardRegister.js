/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import * as AuthService from "../services/auth.service";
import useGlobal from "../store";
import { getGroupBy } from "../services/UniversalAPI";

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

import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { makeStyles, withStyles } from '@material-ui/core/styles';

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

const DashboardRegister = (props) => {
  const [globalState] = useGlobal();
  const classes = useStyles();
  const [rows, setRows] = useState({});
  const [userregisters, setUserRegister] = useState([]);

  useEffect(() => {
    const getCountUserRegister = async () => {
      let xParams = {
        filter: {
          where: { "application": "R8Anywhere" },
          groupBy: "changwat"
        }
      };
      let response = await getGroupBy(xParams, 'teamusers');
      let result = [];
      if (response.status === 200) {
        if (response.data) {
          // console.log(response.data);
          if (response.data.length > 0) {
            // setUserRegister(response.data);
            result = await response.data.map(async (hos) => {
              return {
                changwat: hos.changwat,
                count: hos.count
              };
            });
          }
        }
      }
      return await Promise.all(result);
    }
    getCountUserRegister().then((result) => {
      if (Object.keys(result).length > 0) {
        MakeRows(result);
      }
    });
  }, []);

  const MakeRows = (userregisters) => {
    let row = [];
    let total_user = 0;
    let key = 0;
    userregisters.map((hos) => {
      total_user += hos.count;
      row.push(<StyledTableRow key={key++}>
        <TableCell align="center">{(typeof hos.changwat === 'object')?hos.changwat.changwatname:hos.changwat}</TableCell>
        <TableCell align="center">{typeof hos.count !== "undefined" ? hos.count.toFixed(0) : "0"}</TableCell>
      </StyledTableRow>);
      return null;
    });
    row.push(
      <StyledTableRow key="total">
        <TableCell component="th" scope="row" align="center"><b>รวมทั้งสิ้น</b></TableCell>
        <TableCell align="center"><b>{typeof total_user !== "undefined" ? total_user.toFixed(0) : "0"}</b></TableCell>
      </StyledTableRow>
    );
    setRows(row);
  }
  
  return (
    <div className="container">
      <h4>ผู้ลงทะเบียน</h4>
      <Grid item xs={12}>
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center"><b>จังหวัด</b></StyledTableCell>
                <StyledTableCell align="center"><b>จำนวนผู้ลงทะเบียนใช้งาน</b></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Object.keys(rows).length > 0) && rows}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

export default DashboardRegister;
