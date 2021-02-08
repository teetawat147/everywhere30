import React, { useState, useEffect } from 'react';
import {
  makeStyles
} from '@material-ui/core/styles';
// import * as ICONS from '@material-ui/icons';
import * as ICONS from 'react-icons/md';

import { getYear, getMonth, getDate } from "date-fns";
import
DatePicker, 
{
  registerLocale,
  setDefaultLocale,
  // getDefaultLocale 
} from "react-datepicker";
// npm install react-datepicker --save
import th from 'date-fns/locale/th';

import {
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
  Autocomplete
} from '@material-ui/lab';

import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

import UAPI from "../services/UniversalAPI";

const range = (start, end) => {
  return new Array(end - start).fill().map((d, i) => i + start);
};

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
  helperText: {
    color: 'red'
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
  }
});

export default function UniversalDataTable(props) {
  registerLocale('th', th);
  setDefaultLocale('th');
  const classes = useStyles();
  const [newData, setNewData] = useState({});
  const [validationText, setValidationText] = useState({});

  const years = range(1850, getYear(new Date()) + 1, 1);
  const months = [
    // "January","February","March","April","May","June","July","August","September","October","November","December"
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const makeRadios = (x) => {
    let lookUp=props.lookUp;
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

  const makeMenuItems = (x) => {
    let lookUp=props.lookUp;
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

  const setAutocompleteDefaultValue=(data,key_name,key_config,lookUp)=> {
    let r;
    let data_value=data[key_name];
    let data_lookUp=lookUp[key_config.input_select_source_name];
    if (typeof data_lookUp !='undefined') {
      data_lookUp.map((i,n)=>{
        if (i[key_config.input_select_source_key]===data_value) {
          r=i;
        }
      });
    }
    return r;
  }

  const UniversalInputForm = () => {
    let lookUp = props.lookUp;
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
                  defaultValue={setAutocompleteDefaultValue(newData,field_key,field_config,lookUp)}
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

  const handleSave = () => {
    const createData = async () => {
      let response = await UAPI.create(newData, props.structure.collection_name);
      if (response.status === 200) {
        props.callBackParams('refresh');
        props.callBackParams('close_dialog');
      }
    };
    const updateData = async () => {
      let response = await UAPI.update(newData[props.structure.primary_key], newData, props.structure.collection_name);
      if (response.status === 200) {
        props.callBackParams('refresh');
        props.callBackParams('close_dialog');
      }
    };
    (typeof newData[props.structure.primary_key] != 'undefined') ? updateData() : createData();
  }

  const handleClose = () => {
    props.callBackParams('close_dialog');
  }

  useEffect(() => {
    setNewData(props.newData);
  }, [props.newData]);

  // useEffect(() => {
  //   // getData();
  //   // getLookUp();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>

      <Dialog
        open={props.openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">เพิ่ม : {props.structure.collection_name}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" component={'div'}>
            <table>
              {UniversalInputForm(newData)}
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

    </>
  );
}
