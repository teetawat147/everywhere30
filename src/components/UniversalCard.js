// npm install react-icons --save  // https://react-icons.github.io/react-icons
// npm install @material-ui/icons --save
// npm install @material-ui/lab --save

import React, { useState, useEffect } from 'react';
import {
  // withStyles, 
  makeStyles
} from '@material-ui/core/styles';
import {
  Button,
} from '@material-ui/core';
import * as ICONS from 'react-icons/md';

import { getYear, getMonth, getDate } from "date-fns";
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
import CRUD from "./UniversalCRUD";

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
  const [data, setData] = useState([]);
  const [lookUp, setLookUp] = useState([]);

  // --- CRUD - basic required
  const [newData, setNewData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const callBackParams=(x)=>{
    // eval(x);
    if (x==='refresh') {
      // custom expression
      getData();
    }
    if (x==='close_dialog') {
      // custom expression
      setOpenDialog(false);
    }
  }
  // --- CRUD - basic required END

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
    // console.log(d);
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

  const makeContents = () => {
    if (data) {
      let fields = props.structure.fields;
      let contents = [];

      for (const [field_key, field_config] of Object.entries(props.structure.fields)) {
        if (field_config.data_type === 'date') {
          if (typeof data[field_key] != 'undefined') {
            data[field_key] = new Date(data[field_key]);
          }
        }
      };

      for (const [field_key, field_config] of Object.entries(fields)) {
        if (field_config.show === true) {
          let cv = data[field_key];
          if (field_config.input_type === 'select' | field_config.input_type === 'radio') {
            cv = convertSelectValue(data[field_key], field_key, lookUp[field_config.input_select_source_name], field_config.input_select_source_key, field_config.input_select_source_value);
          }
          if (field_config.data_type === 'date') {
            if (field_config.format === 'thai_short') {
              cv = dateThaiShort(data[field_key]);
            }
          }
          let contentIcon;
          if (typeof field_config.icon != 'undefined') {
            contentIcon = <DynIcon icon={field_config.icon} />;
          }
          let displayStyle = typeof props.display_style != 'undefined' ? props.display_style : 'block';
          contents.push(
            <div key={field_key} style={{ display: displayStyle }}>
              <div className={classes.contentTitle}>
                {contentIcon}
                {field_config.title}
              </div>
              <div className={classes.contentText}>
                {cv}
              </div>
            </div>
          );
        }
      }

      return contents;
    }
  }

  const getData = async (page, rpp) => {
    let response = await UAPI.get(props.document_id, props.structure.collection_name);
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

  const DynIcon = (props) => {
    const X = ICONS[props.icon];
    return (
      <span style={{ marginRight: 3 }}>
        <X size={14} style={{ marginTop: -5 }} />
      </span>
    );
  }

  const handleOpenDialog=()=>{
    setOpenDialog(true);
  }

  useEffect(() => {
    getData();
    getLookUp();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>

      <div style={{border:'solid 1px #d5d5d5', borderRadius:7, padding: 3}}>
        <div style={{textAlign:'right'}}>
          <div style={{position:'relative'}}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<DynIcon icon="MdEdit" />}
              style={{padding: 0, paddingLeft: 12, margin: 0, maxWidth:30, minWidth:30, maxHeight:30, minHeight:30}}
              onClick={handleOpenDialog}
            />
          </div>
        </div>
        <div style={{marginTop:-30}}>
          {makeContents()}
        </div>
      </div>

      <CRUD structure={props.structure} openDialog={openDialog} newData={data} lookUp={lookUp} callBackParams={callBackParams} />

    </>
  );
}
