// npm install react-icons --save  // https://react-icons.github.io/react-icons
// npm install @material-ui/icons --save
// npm install @material-ui/lab --save

import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
// import * as ICONS from '@material-ui/icons';
import * as ICONS from 'react-icons/md';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

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
  // DialogTitle,
  DialogContent,
  // DialogContentText,
  DialogActions,
  // TextField,
  FormControl,
  // InputLabel,
  Select,
  MenuItem,
  // Radio,
  // RadioGroup,
  // FormControlLabel,
  // FormLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from '@material-ui/core';
import {
  // Autocomplete,
  Pagination
} from '@material-ui/lab';

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
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  
  registerLocale('th', th);
  setDefaultLocale('th');
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [focusedPrimaryKey, setFocusedPrimaryKey] = useState(null);
  const [lookUp, setLookUp] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(typeof props.structure.rows_per_page != 'undefined' ? props.structure.rows_per_page : 20);
  const [allPages, setAllPages] = useState();
  const [searchTextFilter, setSearchTextFilter] = useState();
  const [forcePage, setForcePage] = useState(1);

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

  const makeDivRows = () => {
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
              <div key={field_key} style={{ display: 'block' }}>
                <div className={classes.contentTitle}>
                  {field_config.title}
                </div>
                <div className={classes.contentText}>
                  {cv}
                </div>
              </div>
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
          tds.push(<div key="0" style={{textAlign:'center'}}>{btns}</div>);
        }
        tbody.push(<div key={n} style={{ border: 'solid 1px #d5d5d5', marginBottom: 10 }}>{tds}</div>)
      })
      return tbody;
    }
  }

  const getData = async (page, rpp, filter_where) => {
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
    else if (e.target.value.length===0) {
      calAllPages(rowsPerPage);
      getData(0, rowsPerPage);
      setForcePage(1);
    }
  }

  const testInclude = async () => {
    let xParams = {
      filter: {
        limit: 10,
        skip: 50,
        include: "interventions",
      }
    };
    // {"include":"interventions","limit":10}
    let d = await UAPI.getAll(xParams, 'people');
    console.log(d.data);
  }

  useEffect(() => {
    calAllPages(rowsPerPage);
    getData();
    getLookUp();

    testInclude();
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

      {isDesktop&&
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
      }

      {!isDesktop&&
        <div>
          {makeDivRows()}
        </div>
      }

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Pagination count={allPages} page={forcePage} onChange={onClickPage} color="primary" />
      </div>

      <CRUD structure={props.structure} openDialog={openDialog} newData={newData} lookUp={lookUp} callBackParams={callBackParams} />

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
