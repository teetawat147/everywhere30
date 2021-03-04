/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles
} from "@material-ui/core";
import { useDialog } from "../services/dialog/DialogProvider.tsx";
import Form from "react-validation/build/form";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHistory } from "react-router-dom";
import { register } from "../services/auth.service";
import { getAll } from "../services/UniversalAPI";
import validation from "../services/validation";
const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      width: '100%',
    },
    '& .MuiInputLabel-outlined': {
      zIndex: 1,
      transform: 'translate(15px, 4px) scale(1)',
      pointerEvents: 'none'
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(15px, -18px) scale(0.75)',
    },
    '& .Mui-error .MuiInputBase-input': { color: '#f44336' }
  },
  alertDanger: {
    color: '#ec0016',
    backgroundColor: 'none',
    borderColor: 'none',
    position: 'relative',
    padding: '0',
    marginBottom: '1rem',
    border: 'none',
    borderRadius: '.25rem'
  },
  alertSuccess: {
    color: 'green',
    backgroundColor: 'none',
    borderColor: 'none',
    position: 'relative',
    padding: '0',
    marginBottom: '1rem',
    border: 'none',
    borderRadius: '.25rem'
  },
  containerCard: { maxWidth: '400px!important', padding: '40px 40px' }
}));

const Register = (props) => {
  const redirect = useHistory();
  const classes = useStyles();
  const form = useRef();
  const [openDialog, closeDialog] = useDialog();
  const [changwats, setChangwats] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [{ disEmail, disPassword }, setDisabledState] = useState({ disEmail: false, disPassword: false });

  useEffect(() => {
    const setLineInfo = () => {
      if (typeof props.lineInfo !== 'undefined') {
        if (props.lineInfo.email !== '' && props.lineInfo.password !== '') {
          setFormdata({
            ...formData,
            fullname: props.lineInfo.fullname,
            email: props.lineInfo.email,
            password: props.lineInfo.password
          });
          setDisabledState({ disEmail: true, disPassword: true });
        }
      }
    }
    setLineInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.lineInfo]);
  useEffect(() => {
    getChangwat();
  }, []);
  const [formData, setFormdata] = useState({
    fullname: '',
    position: '',
    cid: '',
    email: '',
    mobile: '',
    password: '',
    changwat: '',
    department: ''
  });
  const [validator, setValidator] = useState({
    formElements: {
      fullname: {
        validator: { required: true, minLength: 5 },
        error: { status: false, message: '' }
      },
      position: {
        validator: { required: true, minLength: 5 },
        error: { status: false, message: '' }
      },
      cid: {
        validator: { required: true, number: true, stringLength: 13, pattern: 'mod13' },
        error: { status: false, message: '' }
      },
      email: {
        validator: { required: true, pattern: 'email' },
        error: { status: false, message: '' }
      },
      password: {
        validator: { required: true, minLength: 5 },
        error: { status: false, message: '' }
      },
      mobile: {
        validator: { required: true, stringLength: 10 },
        error: { status: false, message: '' }
      },
      changwat: {
        validator: { required: true },
        error: { status: false, message: '' }
      },
      department: {
        validator: { required: true },
        error: { status: false, message: '' }
      }
    },
    formValid: true
  });
  const onElementChange = (e) => {
    let result = validation(validator, e);
    if (typeof result !== 'undefined') {
      const name = (typeof e.target !== 'undefined') ? e.target.name : e.key;
      const value = (typeof e.target !== 'undefined') ? e.target.value : e.val;
      setFormdata({ ...formData, [name]: value });
      setValidator({ ...validator, formElements: result.formElements, formValid: result.formValid });
    }
  }
  const getChangwat = async () => {
    let response = await getAll({ filter: { "fields": { "changwatname": "true" }, "where": { "zonecode": "08" } } }, 'cchangwats');
    setChangwats(response.data);
  }
  const getDepartment = async (cw) => {
    let response = await getAll({ filter: { "fields": { "hos_id": "true", "hos_name": "true", "hos_fullname": "true" }, "where": { "province_name": cw } } }, 'hospitals');
    setDepartments(response.data);
  }
  const onFormSubmit = (event) => {
    event.preventDefault();
    // Validate all element in form 
    if (validator.formValid) {
      Object.entries(formData).forEach(([k, v]) => {
        onElementChange({ key: k, val: v });
      })
    }
    let formStatus = true;
    let form = { ...validator.formElements };
    for (let name in form) {
      if (form[name].validator.required === true) {
        formStatus = (!form[name].error.status) ? formStatus : false;
      }
    }
    if (formStatus) {
      setValidator({ ...validator, formValid: false });
      register(formData).then((response) => {
        if (response.status === 200) {
          // alert("ลงทะเบียนสำเร็จ รอผู้ดูแลระบบอนุมัติการใช้งาน");
          customDialog({
            title: 'ผลการลงทะเบียน',
            contentWidth: '400px',
            content: <span style={{ color: "green" }}>ลงทะเบียนสำเร็จ รอผู้ดูแลระบบอนุมัติการใช้งาน</span>,
            onClick: () => { closeDialog(); redirect.push("/login"); }
          });
        } else if (response.status === 422) {
          // alert('อีเมลล์นี้ถูกใช้ลงทะเบียนไปแล้ว กรุณาใช้อีเมลล์อื่น');
          // setValidator({ ...validator, formValid: true });
          customDialog({
            title: 'ผลการลงทะเบียน',
            contentWidth: '400px',
            content: <span style={{ color: "red" }}>อีเมลล์นี้ถูกใช้ลงทะเบียนไปแล้ว กรุณาใช้อีเมลล์อื่น</span>,
            onClick: () => { setValidator({ ...validator, formValid: true }); closeDialog(); }
          });
        }
      });
    }
  };
  const customDialog = (data) => {
    openDialog({
      children: (
        <>
          <DialogTitle style={{ padding: '30px 24px 0 24px' }}>{data.title}</DialogTitle>
          <DialogContent style={{ width: data.contentWidth, padding: '24px', textAlign: 'center' }}>{data.content}</DialogContent>
          <DialogActions style={{ padding: '0 24px 24px 24px' }}>
            <Button color="primary" onClick={data.onClick}>ปิด</Button>
          </DialogActions>
        </>
      )
    });
  };
  const registerForm = () => {
    return < div >
      <div className="form-group">
        <TextField
          id="fullname"
          name="fullname"
          label="ชื่อสกุล"
          type="text"
          size="small"
          variant="outlined"
          onChange={(e) => onElementChange(e)}
          value={formData.fullname}
          error={validator.formElements.fullname.error.status}
          helperText={validator.formElements.fullname.error.message}
        />
      </div>
      <div className="form-group">
        <TextField
          id="position"
          name="position"
          label="ตำแหน่ง"
          type="text"
          size="small"
          variant="outlined"
          onChange={(e) => onElementChange(e)}
          value={formData.position}
          error={validator.formElements.position.error.status}
          helperText={validator.formElements.position.error.message}
        />
      </div>
      <div className="form-group">
        <TextField
          id="cid"
          name="cid"
          label="หมายเลขประจำตัวประชาชน"
          type="text"
          size="small"
          variant="outlined"
          onChange={(e) => onElementChange(e)}
          value={formData.cid}
          error={validator.formElements.cid.error.status}
          helperText={validator.formElements.cid.error.message}
        />
      </div>
      <div className="form-group">
        <TextField
          id="mobile"
          name="mobile"
          label="หมายเลขโทรศัพท์"
          type="text"
          size="small"
          variant="outlined"
          onChange={(e) => onElementChange(e)}
          value={formData.value}
          error={validator.formElements.mobile.error.status}
          helperText={validator.formElements.mobile.error.message}
        />
      </div>
      <div className="form-group">
        <TextField
          id="email"
          name="email"
          label="อีเมลล์"
          type="text"
          size="small"
          variant="outlined"
          autoComplete='new-password'
          onChange={(e) => onElementChange(e)}
          value={formData.email}
          error={validator.formElements.email.error.status}
          helperText={validator.formElements.email.error.message}
          disabled={disEmail}
        />
      </div>
      <div className="form-group">
        <TextField
          id="password"
          name="password"
          label="รหัสผ่าน"
          type="password"
          size="small"
          variant="outlined"
          autoComplete='new-password'
          onChange={(e) => onElementChange(e)}
          value={formData.value}
          error={validator.formElements.password.error.status}
          helperText={validator.formElements.password.error.message}
          disabled={disPassword}
        />
      </div>
      <div className="form-group">
        <Autocomplete
          id="changwat"
          size="small"
          fullWidth
          options={changwats}
          getOptionSelected={(option, value) => value.changwatname === option.changwatname}
          getOptionLabel={(option) => option.changwatname || ''}
          onChange={(e, newValue) => {
            let changwatName = (newValue != null) ? newValue.changwatname : '';
            setFormdata({
              ...formData,
              changwat: changwatName,
              department: ''
            });
            onElementChange({ key: 'changwat', val: changwatName });
            if (changwatName !== '') { getDepartment(changwatName) }
          }}
          renderInput={(params) =>
            <TextField {...params}
              id="changwat_texfield"
              name="changwat"
              label="จังหวัด"
              variant="outlined"
              onChange={(e) => onElementChange(e)}
              error={validator.formElements.changwat.error.status}
              helperText={validator.formElements.changwat.error.message}
            />
          }
        />
      </div>
      <div className="form-group">
        <Autocomplete
          id="department"
          size="small"
          fullWidth
          options={departments}
          getOptionSelected={(option, value) => {
            return value === option
          }}
          getOptionLabel={(option) => option.hos_name || ''}
          value={formData.department}
          onChange={(_, newValue) => {
            delete Object.assign(newValue, { 'hcode': newValue['hos_id'] })['hos_id'];
            setFormdata({ ...formData, department: (newValue !== null) ? newValue : '' });
            onElementChange({ key: 'department', val: (newValue !== null) ? newValue : '' });
          }}
          renderInput={(params) => <TextField {...params}
            label="หน่วยงาน"
            variant="outlined"
            onChange={(e) => onElementChange(e)}
            error={validator.formElements.department.error.status}
            helperText={validator.formElements.department.error.message}
          />}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-primary btn-block" disabled={!validator.formValid}>ลงทะเบียน</button>
      </div>
    </div>
  }

  return (
    <div className="col-md-12">
      <div className={"card " + classes.containerCard}>
        <label htmlFor="caption" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>ลงทะเบียน</h3>
        </label>
        <Form className={classes.root} onSubmit={onFormSubmit} ref={form} autoComplete="new-password">
          {registerForm()}
        </Form>
      </div>
    </div>
  );
};

export default Register;
