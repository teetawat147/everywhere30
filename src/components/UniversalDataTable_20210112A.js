// npm install react-icons --save  // https://react-icons.github.io/react-icons
// npm install @material-ui/icons --save
// npm install @material-ui/lab --save

import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
// import * as ICONS from '@material-ui/icons';
import * as ICONS from 'react-icons/md';

import { getYear, getMonth, getDate } from "date-fns";
import
DatePicker, {
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from '@material-ui/core';
import {
  Autocomplete,
  Pagination
} from '@material-ui/lab';

const range = (start, end) => {
  return new Array(end - start).fill().map((d, i) => i + start);
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
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

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  helperText: {
    color: 'red'
  }
});

export default function UniversalDataTable(props) {
  registerLocale('th', th);
  setDefaultLocale('th');
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [newData, setNewData] = useState({});
  const [focusedPrimaryKey, setFocusedPrimaryKey] = useState(null);
  const [lookUp, setLookUp] = useState([]);
  const [validationText, setValidationText] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(typeof props.structure.rows_per_page != 'undefined' ? props.structure.rows_per_page : 20);
  const [allPages, setAllPages] = useState();
  const [searchTextFilter, setSearchTextFilter] = useState();
  const [forcePage, setForcePage] = useState(1);
  
  const years = range(1850, getYear(new Date()) + 1, 1);
  const months = [
    // "January","February","March","April","May","June","July","August","September","October","November","December"
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const makeHeaderRow = () => {
    let fields = props.structure.fields;
    let tr = [];
    for (const [field_key, field_config] of Object.entries(fields)) {
      if (field_config.show === true) {
        let colIcon;
        if (typeof field_config.icon != 'undefined') {
          colIcon = <DynIcon icon={field_config.icon} />;
        }
        tr.push(
          <StyledTableCell key={field_key}>
            {colIcon}
            {field_config.title}
          </StyledTableCell>
        );
      }
    }

    if (props.structure.create_document) {
      tr.push(
        <StyledTableCell key="btnAdd">
          <div style={{ padding: 0, backgroundColor: '#FFFFFF', borderRadius: 5, width: 43, height: 35, textAlign: 'center' }}>
            <IconButton variant="outlined" color="primary" onClick={handleClickAdd} style={{ margin: 0, marginTop: -8 }}>
              <DynIcon icon='MdAddCircle' />
            </IconButton>
          </div>
        </StyledTableCell>
      );
    }
    else {
      tr.push(<StyledTableCell key="0"><br /></StyledTableCell>);
    }
    return tr;
  }

  const convertSelectValue = (data_value, field_name, look_up, k, v) => {
    let r = data_value;
    if (typeof look_up != 'undefined') {
      look_up.forEach(i => {
        if (typeof i[k] != 'undefined' & typeof data_value != 'undefined') {
          if (i[k].toString() === data_value.toString()) {
            r = i[v];
          }
        }
      });
    }
    return r;
  }

  const dateThaiShort = (d) => {
    let r = d;
    if (d && typeof d != 'undefined') {
      r = parseInt(getDate(d)).toString() + ' ' + thaiMonth(parseInt(getMonth(d)) + 1, 'short') + ' ' + (parseInt(getYear(d)) + 543).toString();
    }
    else {
      r = '-';
    }
    return r;
  }

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
      let fields = props.structure.fields;
      let tbody = [];
      let n = 0;
      data.forEach(data_row => {
        ++n;
        let tds = [];
        let btns = [];

        for (const [field_key, field_config] of Object.entries(props.structure.fields)) {
          if (field_config.data_type === 'date') {
            if (typeof data_row[field_key] != 'undefined') {
              data_row[field_key] = new Date(data_row[field_key]);
            }
          }
        };

        for (const [field_key, field_config] of Object.entries(fields)) {
          if (field_config.show === true) {
            let cv = data_row[field_key];
            if (field_config.input_type === 'select' | field_config.input_type === 'radio') {
              cv = convertSelectValue(data_row[field_key], field_key, lookUp[field_config.input_select_source_name], field_config.input_select_source_key, field_config.input_select_source_value);
            }
            if (field_config.data_type === 'date') {
              if (field_config.format === 'thai_short') {
                cv = dateThaiShort(data_row[field_key]);
              }
            }
            tds.push(
              <StyledTableCell key={field_key}>
                {cv}
              </StyledTableCell>
            );
          }
        }
        if (props.structure.update_document) {
          btns.push(
            <IconButton key="btnEdit" variant="outlined" color="primary" onClick={() => handleClickEdit(data_row[props.structure.primary_key])} style={{ margin: 2 }}>
              <DynIcon icon='MdEdit' />
            </IconButton>
          );
        }
        if (props.structure.delete_document) {
          btns.push(
            <IconButton key="btnDelete" variant="outlined" color="secondary" onClick={() => handleClickDelete(data_row[props.structure.primary_key])} style={{ margin: 2 }}>
              <DynIcon icon='MdDelete' />
            </IconButton>
          );
        }

        if (btns.length > 0) {
          tds.push(<StyledTableCell key="0">{btns}</StyledTableCell>);
        }
        tbody.push(<StyledTableRow key={n}>{tds}</StyledTableRow>)
      })
      return tbody;
    }
  }

  const makeMenuItems = (x) => {
    let menuItems = [];
    menuItems.push(<MenuItem key="0" value="" style={{ height: 0, padding: 0, margin: 0 }}></MenuItem>);
    if (x.input_select_source_type === 'db' | x.input_select_source_type === 'json') {
      if (lookUp[x.input_select_source_name]) {
        lookUp[x.input_select_source_name].forEach(i => {
          menuItems.push(
            <MenuItem key={i[x.input_select_source_key]} value={i[x.input_select_source_key]}>{i[x.input_select_source_value]}</MenuItem>
          );
        });
      }
    }
    return menuItems;
  }

  const makeRadios = (x) => {
    let menuItems = [];
    if (x.input_select_source_type === 'db' | x.input_select_source_type === 'json') {
      if (lookUp[x.input_select_source_name]) {
        lookUp[x.input_select_source_name].forEach(i => {
          menuItems.push(
            <FormControlLabel style={{ margin: 0 }} key={i[x.input_select_source_key]} value={i[x.input_select_source_key]} control={<Radio />} label={i[x.input_select_source_value]} />
          );
        });
      }
    }
    return menuItems;
  }

  const UniversalInputForm = () => {
    let fields = props.structure.fields;
    let tbody = [];
    let trs = [];
    for (const [field_key, field_config] of Object.entries(fields)) {
      if (field_config.show === true) {
        if (field_config.input_type === 'textbox') {
          trs.push(
            <tr key={field_key}><td>
              <TextField
                label={field_config.title}
                name={field_key}
                defaultValue={newData[field_key]}
                variant="outlined"
                style={{ marginBottom: 8 }}
                onChange={(e) => onchangeText(e, field_config)}
                helperText={validationText[field_key]}
                FormHelperTextProps={{ className: classes.helperText }}
              />
            </td></tr>
          );
        }
        else if (field_config.input_type === 'datepicker') {
          trs.push(
            <tr key={field_key}><td>

              <FormControl variant="outlined" style={{ width: '100%', marginBottom: 8 }}>
                <InputLabel id={field_key}>{field_config.title}</InputLabel>
                <DatePicker
                  name={field_key}
                  dateFormat="dd/MM/yyyy"
                  labelId={field_key}
                  renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                    <div style={{ margin: 10, display: "flex", justifyContent: "space-between" }}>
                      <button style={{ width: 25, height: 25, borderRadius: 3, border: 'solid 1px grey' }} onClick={decreaseMonth} disabled={prevMonthButtonDisabled}> {"<"} </button>
                      <select style={{ height: 25 }} value={getYear(date)} onChange={({ target: { value } }) => changeYear(value)} >
                        {years.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <select style={{ height: 25 }} value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} >
                        {months.map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <button style={{ width: 25, height: 25, borderRadius: 3, border: 'solid 1px grey' }} onClick={increaseMonth} disabled={nextMonthButtonDisabled}> {">"} </button>
                    </div>
                  )}
                  selected={newData[field_key]}
                  onChange={(date) => onchangeDatePicker(date, field_key)}
                >
                </DatePicker>
              </FormControl>

            </td></tr >
          );
        }
        // ทำ checkbox ต่อ
        else if (field_config.input_type === 'select') {
          trs.push(
            <tr key={field_key}>
              <td>
                <FormControl variant="outlined" style={{ width: '100%', marginBottom: 8 }}>
                  <InputLabel id={field_key}>{field_config.title}</InputLabel>
                  <Select labelId={field_key} defaultValue={typeof newData[field_key] === 'undefined' ? '' : newData[field_key]} label={field_config.title} name={field_key} onChange={onchangeText}>
                    {makeMenuItems(field_config)}
                  </Select>
                </FormControl>
              </td>
            </tr>
          );
        }
        else if (field_config.input_type === 'autocomplete') {
          trs.push(
            <tr key={field_key}>
              <td>
                <Autocomplete
                  options={lookUp[field_config.input_select_source_name]}
                  getOptionLabel={(option) => option.hos_name}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label={field_config.title} variant="outlined" />}
                />
              </td>
            </tr>
          );
        }
        else if (field_config.input_type === 'radio') {
          trs.push(
            <tr key={field_key}><td>
              <FormControl fullWidth component="fieldset" style={{ border: 'solid 1px #c4c4c4', borderRadius: 5 }}>
                <FormLabel component="legend" style={{ width: 'auto' }}>{field_config.title}</FormLabel>
                <RadioGroup name={field_key} defaultValue={newData[field_key]} onChange={onchangeText}>
                  {makeRadios(field_config)}
                </RadioGroup>
              </FormControl>
            </td></tr>
          );
        }
        else {
          trs.push(
            <tr key={field_key}><td>
              <TextField ref={input => input && input.focus()} label={field_config.title} name={field_key} value={newData[field_key]} variant="outlined" style={{ marginBottom: 8 }} onChange={onchangeText} />
            </td></tr>
          );
        }
      }
    }

    tbody.push(<tbody key="0">{trs}</tbody>);
    return tbody;
  }

  const getData = async (page, rpp, filter_where) => {
    // setRowsPerPage(typeof props.structure.rows_per_page != 'undefined'?props.structure.rows_per_page:20);
    // let documentsCount = await UAPI.getCount({}, props.structure.collection_name);
    // setAllPages(Math.ceil(parseInt(documentsCount.data.count)/parseInt(rowsPerPage)));
    let xSkip=0;
    let xLimit = rowsPerPage;
    let xWhere = {};
    if (typeof rpp != 'undefined') {
      xLimit = rpp;
    }

    if (typeof page !== 'undefined') {
      xSkip = rowsPerPage * page;
    }

    if (typeof filter_where !== 'undefined') {
      xWhere = filter_where;
    }

    let xParams = {
      filter: {
        limit: xLimit,
        skip: xSkip,
        where: xWhere,
      }
    };

    let response = await UAPI.getLimit(xParams, props.structure.collection_name);
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

  const handleClickAdd = () => {
    setNewData({});
    setOpenDialog(true);
  }

  const handleClickEdit = (primary_key) => {
    setNewData([]);
    data.forEach(i => {
      if (i[props.structure.primary_key] === primary_key) {
        setNewData({ ...newData, ...i });
      }
    });
    setOpenDialog(true);
  }

  const handleClickDelete = (primary_key) => {
    setFocusedPrimaryKey(primary_key);
    setOpenConfirm(true);
  }

  const handleDelete = async () => {
    let response = await UAPI.remove(focusedPrimaryKey, props.structure.collection_name);
    if (response.status === 200) {
      getData();
      setOpenConfirm(false);
    }
  }

  const handleSave = () => {
    const createData = async () => {
      let response = await UAPI.create(newData, props.structure.collection_name);
      if (response.status === 200) {
        getData();
        setOpenDialog(false);
      }
    };
    const updateData = async () => {
      let response = await UAPI.update(newData[props.structure.primary_key], newData, props.structure.collection_name);
      if (response.status === 200) {
        getData();
        setOpenDialog(false);
      }
    };
    (typeof newData[props.structure.primary_key] != 'undefined') ? updateData() : createData();
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  const onchangeDatePicker = (date, key) => {
    let x = newData;
    x[key] = date;
    setNewData({ ...newData, ...x });
  }

  const onchangeText = (e, x) => {
    newData[e.target.name] = e.target.value;
    setNewData(newData);

    const processValidText = (expression, key, value, text) => {
      if (expression) {
        let x = validationText;
        if (typeof x[key] != 'undefined') {
          x[key] = x[key].replace(text, '');
          setValidationText({ ...validationText, ...x });
        }
      }
      else {
        newData[key] = value;
        setNewData(newData);
        let x = validationText;
        x[key] = text;
        setValidationText({ ...validationText, ...x });
      }
    }

    if (x) {
      let validation = x.validation;
      if (typeof validation != 'undefined') {
        if (validation === 'number') {
          processValidText((/^[0-9]+$/.test(e.target.value)), e.target.name, e.target.value, 'กรอกตัวเลขเท่านั้น');
        }
        if (validation === 'string') {
          processValidText((/^[a-zA-Z\u0E00-\u0E7F]*$/.test(e.target.value)), e.target.name, e.target.value, 'กรอกตัวอักษรเท่านั้น');
        }
      }

      let lengthType = x.value_length_type;
      if (typeof lengthType != 'undefined') {
        if (lengthType === 'fix') {
          let lengthCount = x.value_length_count;
          if (typeof lengthCount != 'undefined') {
            processValidText((e.target.value.length === lengthCount), e.target.name, e.target.value, 'จำนวนอักขระต้องเท่ากับ ' + lengthCount + ' ตัว');
          }
        }
        if (lengthType === 'range') {
          let lengthMin = x.value_length_min;
          let lengthMax = x.value_length_max;
          if (typeof lengthMin != 'undefined' && typeof lengthMax != 'undefined') {
            processValidText((e.target.value.length >= lengthMin && e.target.value.length <= lengthMax), e.target.name, e.target.value, 'จำนวนอักขระต้องเป็น ' + lengthMin + ' ถึง ' + lengthMax + ' ตัว');
          }
        }
      }
    }
  }

  const ConfirmDialog = (props) => {
    // const { title, children, open, setOpen, onConfirm } = props;
    const { children, open, setOpen, onConfirm } = props;
    return (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="confirm-dialog"
      >
        {/* <DialogTitle id="confirm-dialog">{title}</DialogTitle> */}
        <DialogContent><div style={{ padding: 20 }}>{children}</div></DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            color="default"
          >
            No
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
            color="secondary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const DynIcon = (props) => {
    const X = ICONS[props.icon];
    return (
      <span style={{ marginRight: 5 }}>
        <X size={20} />
      </span>
    );
  }

  const onClickPage = (e, page) => {
    // getData(page - 1);
    getData(page - 1, rowsPerPage, searchTextFilter);
    setForcePage(page);
  }

  const onRppChange = (e) => {
    setRowsPerPage(e.target.value);
    getData(0, e.target.value);
    calAllPages(e.target.value);
  }

  const calAllPages = async (x,p) => {
    let xWhere = {};
    if (typeof p !== 'undefined') {
      xWhere = p;
    }
    let xParams = { where: xWhere };
    let documentsCount = await UAPI.getCount(xParams, props.structure.collection_name);
    setAllPages(parseInt(Math.ceil(parseInt(documentsCount.data.count) / parseInt(x))));
  }

  const onchangeSearchText = (e) => {
    // https://loopback.io/doc/en/lb3/Where-filter.html
    let text = e.target.value.trim();
    let filter_where = {};

    if (text.length>0) {
      if (typeof props.structure.search_field != 'undefined') {
        let f = props.structure.search_field;
        let wf = [];
        if (f.length>0) {
          f.map((d, i) => { 
            wf.push({[d]:{like:text}});
          });
        }
        filter_where = { or: wf };
      }
      setSearchTextFilter(filter_where);;
      calAllPages(rowsPerPage, filter_where);
      getData(0, rowsPerPage, filter_where);
      setForcePage(1);
    }
    else if (e.target.value.length==0) {
      calAllPages(rowsPerPage);
      getData(0, rowsPerPage);
      setForcePage(1);
    }
  }

  useEffect(() => {
    calAllPages(rowsPerPage);
    getData();
    getLookUp();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* <select style={{ height: 25 }} value={months[getMonth(date)]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))} > */}
      <div style={{ marginBottom: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ width: '100%' }}>
          <OutlinedInput
            name="searchText"
            variant="outlined"
            placeholder="ค้นหา"
            style={{ width: '100%' }}
            onChange={(e) => onchangeSearchText(e)}
            startAdornment={
              <InputAdornment position="start">
                <DynIcon icon="MdSearch" />
              </InputAdornment>
            }
          />
        </div>
        <div style={{ whiteSpace: 'nowrap', marginLeft: 10 }}>

          <FormControl variant="outlined" style={{ width: '100%' }}>
            <Select value={rowsPerPage} onChange={onRppChange}>
              <MenuItem key={10} value={10}>{10} แถว</MenuItem>
              <MenuItem key={20} value={20}>{20} แถว</MenuItem>
              <MenuItem key={30} value={30}>{30} แถว</MenuItem>
              <MenuItem key={40} value={40}>{40} แถว</MenuItem>
              <MenuItem key={50} value={50}>{50} แถว</MenuItem>
              <MenuItem key={100} value={100}>{100} แถว</MenuItem>
            </Select>
          </FormControl>

        </div>
      </div>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              {makeHeaderRow()}
            </TableRow>
          </TableHead>
          <TableBody>
            {makeRows()}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Pagination count={allPages} page={forcePage} onChange={onClickPage} color="primary" />
      </div>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">เพิ่ม : {props.structure.collection_name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component={'div'}>
            <table>
              {UniversalInputForm()}
            </table>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSave}>
            บันทึก
          </Button>
          <Button variant="contained" onClick={handleClose} autoFocus>
            ปิด
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        // title="ลบข้อมูล"
        open={openConfirm}
        setOpen={setOpenConfirm}
        onConfirm={handleDelete}
      >
        ต้องการลบข้อมูลนี้ใช่หรือไม่!?
      </ConfirmDialog>

      <div style={{ height: 50 }}></div>
    </>
  );
}
