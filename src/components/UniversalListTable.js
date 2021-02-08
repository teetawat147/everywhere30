// npm install react-icons --save  // https://react-icons.github.io/react-icons
// npm install @material-ui/icons --save
// npm install @material-ui/lab --save

import React, { useState, useEffect } from 'react';
import { 
  // withStyles, 
  makeStyles 
} from '@material-ui/core/styles';
// import * as ICONS from '@material-ui/icons';
import * as ICONS from 'react-icons/md';

// import { getYear, getMonth, getDate } from "date-fns";
import
// DatePicker, 
{
  registerLocale,
  setDefaultLocale,
  // getDefaultLocale 
} from "react-datepicker";
// npm install react-datepicker --save
import th from 'date-fns/locale/th';

import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

import UAPI from "../services/UniversalAPI";

import {
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  // Paper,
  // Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  // DialogActions,
  // TextField,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
  // Radio,
  // RadioGroup,
  // FormControlLabel,
  // FormLabel,
  // IconButton,
} from '@material-ui/core';

// import {
//   Autocomplete,
// } from '@material-ui/lab';

// const range = (start, end) => {
//   return new Array(end - start).fill().map((d, i) => i + start);
// };

// const useStyles = makeStyles({
//   table: {
//     minWidth: 700,
//     borderSpacing: 10,
//     borderCollapse: 'separate'
//   }
// });

export default function UniversalDataTable(props) {
  registerLocale('th', th);
  setDefaultLocale('th');
  // const classes = useStyles();
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  // const [openConfirm, setOpenConfirm] = useState(false);
  const [lookUp, setLookUp] = useState([]);

  // const years = range(1850, getYear(new Date()) + 1, 1);
  // const months = [
  //   // "January","February","March","April","May","June","July","August","September","October","November","December"
  //   "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  // ];

  const makeHeaderRow = () => {
    let tr = [];

    tr.push(
      <td key={'tdmin'}>
        <div style={{ width: 15, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, borderTopRightRadius: 0, borderBottomRightRadius: 0, border: 'solid 1px #92D8FF', borderRight: 0, backgroundColor: '#92D8FF', marginBottom: 3 }}>
          <br />
        </div>
      </td>
    );
    if (typeof props.column_set != 'undefined') {
      let i = 0;
      // console.log(props.column_set);
      props.column_set.forEach(column => {
        ++i;
        tr.push(
          <td key={i}>
            <div style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, border: 'solid 1px #92D8FF', borderLeft: 0, borderRight: 0, backgroundColor: '#92D8FF', marginBottom: 3 }}>
              {column.title}
            </div>
          </td>
        );
      });
    };

    if (typeof props.sub_report != 'undefined') {
      if (props.sub_report === true) {
        tr.push(
          <td key={'tdbtn'} style={{ width: 30 }}>
            <div style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, border: 'solid 1px #92D8FF', borderLeft: 0, borderRight: 0, backgroundColor: '#92D8FF', marginBottom: 3 }}>
              <br />
            </div>
          </td>
        );
      }
    }

    tr.push(
      <td key={'tdmax'}>
        <div style={{ width: 15, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 20, borderBottomRightRadius: 20, border: 'solid 1px #92D8FF', borderLeft: 0, backgroundColor: '#92D8FF', marginBottom: 3 }}>
          <br />
        </div>
      </td>
    );

    return tr;
  }

  // const convertSelectValue = (data_value, field_name, look_up, k, v) => {
  //   let r = data_value;
  //   if (typeof look_up != 'undefined') {
  //     look_up.forEach(i => {
  //       if (typeof i[k] != 'undefined' & typeof data_value != 'undefined') {
  //         if (i[k].toString() === data_value.toString()) {
  //           r = i[v];
  //         }
  //       }
  //     });
  //   }
  //   return r;
  // }

  // const dateThaiShort = (d) => {
  //   let r = d;
  //   // console.log(d);
  //   if (d && typeof d != 'undefined') {
  //     r = parseInt(getDate(d)).toString() + ' ' + thaiMonth(parseInt(getMonth(d)) + 1, 'short') + ' ' + (parseInt(getYear(d)) + 543).toString();
  //   }
  //   else {
  //     r = '-';
  //   }
  //   return r;
  // }

  const thaiMonth = (m, z) => {
    let x = parseInt(m);
    let r = m;
    if (z === 'short') {
      switch (x) {
        case 1: r = 'ม.ค.'; break;
        case 2: r = 'ก.พ.'; break;
        case 3: r = 'มี.ค.'; break;
        case 4: r = 'เม.ย.'; break;
        case 5: r = 'พ.ค.'; break;
        case 6: r = 'มิ.ย.'; break;
        case 7: r = 'ส.ค.'; break;
        case 8: r = 'ก.ค.'; break;
        case 9: r = 'ก.ย.'; break;
        case 10: r = 'ต.ค.'; break;
        case 11: r = 'พ.ย.'; break;
        case 12: r = 'ธ.ค.'; break;
        default: r = ''; break;
      }
    }
    if (z === 'long') {
      switch (x) {
        case 1: r = 'มกราคม'; break;
        case 2: r = 'กุมภาพันธ์'; break;
        case 3: r = 'มีนาคม'; break;
        case 4: r = 'เมษายน'; break;
        case 5: r = 'พฤษภาคม'; break;
        case 6: r = 'มิถุนายน'; break;
        case 7: r = 'สิงหาคม'; break;
        case 8: r = 'กรกฎาคม'; break;
        case 9: r = 'กันยายน'; break;
        case 10: r = 'ตุลาคม'; break;
        case 11: r = 'พฤศจิกายน'; break;
        case 12: r = 'ธันวาคม'; break;
        default: r = ''; break;
      }
    }
    return r;
  }

  const makeRows = () => {
    if (data) {
      // let fields = props.structure.fields;
      // let tbody = [];
      let n = 0;
      let columnSetData = [];

      data.forEach(data_row => {
        ++n;
        // let tds = [];
        // let btns = [];

        for (const [field_key, field_config] of Object.entries(props.structure.fields)) {
          if (field_config.data_type === 'date') {
            if (typeof data_row[field_key] != 'undefined') {
              data_row[field_key] = new Date(data_row[field_key]);
            }
          }
        };

        if (typeof props.column_set != 'undefined') {
          // console.log(props.column_set);
          let x = [];
          props.column_set.forEach(column => {
            let columnText = '';
            if (column.fields.length > 1) {
              column.fields.forEach(i => {
                // console.log(i);
                columnText = columnText + ' ' + data_row[i];
              });
            }
            else {
              // console.log(column.fields[0]);
              columnText = data_row[column.fields[0]];
            }
            x.push(columnText);
            // console.log(x);
          });
          columnSetData.push(x);
        }
      });

      // console.log(columnSetData);

      let xTR = [];
      let r_count = 0;
      columnSetData.forEach(r => {
        ++r_count;
        let c_count = 0;
        let xTD = [];

        xTD.push(
          <td key={'tdmin'}>
            <div style={{ width: 15, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, borderTopRightRadius: 0, borderBottomRightRadius: 0, border: 'solid 1px #AAAAAA', borderRight: 0, marginBottom: 3 }}>
              <br />
            </div>
          </td>
        );

        r.forEach(c => {
          ++c_count;
          xTD.push(
            <td key={c_count}>
              <div style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, border: 'solid 1px #AAAAAA', borderLeft: 0, borderRight: 0, marginBottom: 3 }}>
                {c}
              </div>
            </td>
          );
        });

        if (typeof props.sub_report != 'undefined') {
          if (props.sub_report === true) {
            xTD.push(
              <td key={'tdbtn'} style={{ width: 30 }}>
                <div style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0, border: 'solid 1px #AAAAAA', borderLeft: 0, borderRight: 0, marginBottom: 3 }}>
                  <DynIcon style={{ margin: 0, padding: 0, cursor: 'pointer' }} icon='MdEventNote' onClick={onDetailBtnClick} />
                </div>
              </td>
            );
          }
        }

        xTD.push(
          <td key={'tdmax'}>
            <div style={{ width: 15, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 20, borderBottomRightRadius: 20, border: 'solid 1px #AAAAAA', borderLeft: 0, marginBottom: 3 }}>
              <br />
            </div>
          </td>
        );

        xTR.push(<tr key={r_count}>{xTD}</tr>);
      });
      return xTR;
    }
  }

  const onDetailBtnClick = () => {
    console.log('onDetailBtnClick----');
    setOpenDialog(true);
  }

  const getData = async () => {
    let response = await UAPI.getAll({}, props.structure.collection_name);
    if (response.status === 200) {
      if (response.data) {
        setData(response.data);
      }
    }
  }

  const getLookUp = () => {
    const makeLookUpData = async (collection_name) => {
      let response = await UAPI.getAll({}, collection_name);
      if (response.status === 200) {
        if (response.data) {
          lookUp[collection_name] = response.data;
          setLookUp(lookUp);
        }
      }
    }

    let fields = props.structure.fields;
    let x = [];
    for (const [k, v] of Object.entries(fields)) {
      if (v.input_select_source_type === 'db') {
        if (typeof v.input_select_source_name != 'undefined') {
          if (v.input_select_source_name.length > 0) {
            x.push(v.input_select_source_name);
          }
        }
      }
      else if (v.input_select_source_type === 'json') {
        if (typeof v.input_select_source_json != 'undefined') {
          if (v.input_select_source_json.length > 0) {
            lookUp[v.input_select_source_name] = v.input_select_source_json;
            setLookUp(lookUp);
          }
        }
      }
    }

    x.forEach(element => {
      makeLookUpData(element);
    });
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const DynIcon = (props) => {
    const X = ICONS[props.icon];
    return (
      <span style={{ marginLeft: 5, marginRight: 5 }}>
        <X size={20} {...props} />
      </span>
    );
  }

  useEffect(() => {
    getData();
    getLookUp();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>

      <table cellPadding={0} cellPadding={0}>
        <thead>
          <tr>
            {makeHeaderRow()}
          </tr>
        </thead>
        <tbody>
          {makeRows()}
        </tbody>
      </table>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">เพิ่ม : {props.structure.collection_name}</DialogTitle> */}
        <DialogTitle id="alert-dialog-title">ผลแลป xxxxxx</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component={'div'}>
            <table style={{width:'100%'}}>
              <thead>
                <tr>
                  <td>แลป</td>
                  <td>ผล</td>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td>LAB1</td><td>11</td>
                </tr>
                <tr>
                <td>LAB2</td><td>22</td>
                </tr>
                <tr>
                <td>LAB3</td><td>33</td>
                </tr>
                <tr>
                <td>LAB4</td><td>44</td>
              </tr>
              </tbody>
            </table>
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSave}>
            บันทึก
          </Button>
          <Button variant="contained" onClick={handleClose} autoFocus>
            ปิด
          </Button>
        </DialogActions> */}
      </Dialog>

      <div style={{ height: 50 }}></div>

    </>
  );
}
