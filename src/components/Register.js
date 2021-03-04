/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from '@material-ui/core';
import Form from "react-validation/build/form";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckButton from "react-validation/build/button";
// import { isEmail } from "validator";
import { useHistory } from "react-router-dom";
import * as AuthService from "../services/auth.service";
import { getAll } from "../services/UniversalAPI";
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
  const checkBtn = useRef();
  // const [fullname, setFullname] = useState('');
  // const [position, setPosition] = useState('');
  // const [cid, setCid] = useState('');
  // const [mobile, setMobile] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [changwats, setChangwats] = useState([]);
  const [changwat, setChangwat] = useState('');
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState('');
  const [departmentI, setDepartmentI] = useState('');
  const [{ disEmail, disPassword }, setDisabledState] = useState({ disEmail: false, disPassword: false });

  useEffect(() => {
    const setLineInfo = () => {
      if (typeof props.lineInfo !== 'undefined') {
        if (props.lineInfo.email !== '' && props.lineInfo.password !== '') {
          let formInit = { ...validator.formElements };
          formInit.fullname.value = props.lineInfo.fullname;
          formInit.email.value = props.lineInfo.email;
          formInit.password.value = props.lineInfo.password;
          setValidator({ ...validator, formElements: formInit, formValid: true });
          setDisabledState({ disEmail: true, disPassword: true });
        }
      }
    }
    setLineInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.lineInfo]);

  const [validator, setValidator] = useState({
    formElements: {
      fullname: {
        type: 'text',
        value: '',
        validator: { required: true, minLength: 5 },
        error: { status: false, message: '' }
      },
      position: {
        type: 'text',
        value: '',
        validator: { required: true, minLength: 5 },
        error: { status: false, message: '' }
      },
      cid: {
        type: 'text',
        value: '',
        validator: { required: true, stringLength: 13 },
        error: { status: false, message: '' }
      },
      email: {
        type: 'email',
        value: '',
        validator: { required: true, pattern: 'email' },
        error: { status: false, message: '' }
      },
      password: {
        type: 'text',
        value: '',
        validator: { required: true, minLength: 5 },
        error: { status: false, message: '' }
      },
      mobile: {
        type: 'text',
        value: '',
        validator: { required: true, stringLength: 10 },
        error: { status: false, message: '' }
      },
      changwat: {
        type: 'text',
        value: '',
        validator: { required: true },
        error: { status: false, message: '' }
      }
    },
    formValid: true
  });
  const onElementChange = (e) => {
    const name = (typeof e.target !== 'undefined') ? e.target.name : e.name;
    const value = (typeof e.target !== 'undefined') ? e.target.value : e.value;
    let updateForm = { ...validator.formElements };
    if (typeof updateForm[name] !== 'undefined') {
      updateForm[name].value = value;
      updateForm[name].touched = true;
      const validatorObject = checkValidator(value, updateForm[name].validator);
      updateForm[name].error = {
        status: validatorObject.status,
        message: validatorObject.message
      }
      let formStatus = true;
      for (let name in updateForm) {
        if (updateForm[name].validator.required === true) {
          formStatus = (!updateForm[name].error.status) ? formStatus : false;
        }
      }
      setValidator({ ...validator, formElements: updateForm, formValid: formStatus });
    }
  }
  const checkValidator = (value, rule) => {
    let valid = true;
    let message = '';
    // ห้ามว่าง
    if (rule.required) {
      if (value.trim().length === 0) {
        valid = false;
        message = 'กรุณากรอกข้อมูล';
      }
    }
    // ความยาวต้องเท่ากับ
    if (typeof rule.stringLength !== 'undefined' && value.length !== rule.stringLength && valid) {
      valid = false;
      message = `ความยาว ${rule.stringLength} ตัวอักษร`;
    }
    // ความยาวอย่างน้อย
    if (typeof rule.minLength !== 'undefined' && value.length < rule.minLength && valid) {
      valid = false;
      message = `กรุณากรอกข้อมูลอยางน้อย ${rule.minLength} ตัวอักษร`;
    }
    // ความยาวต้องไม่มากกว่า
    if (typeof rule.maxLength !== 'undefined' && value.length > rule.maxLength && valid) {
      valid = false;
      message = `กรุณากรอกข้อมูลไม่เกิน ${rule.maxLength} ตัวอักษร`;
    }
    // รูปแบบอีเมลล์
    if (typeof rule.pattern !== 'undefined' && rule.pattern === 'email' && valid) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) === false) {
        valid = false;
        message = `อีเมลล์ไม่ถูกต้อง`;
      }
    }
    return { status: !valid, message: message };
  }

  const getChangwat = async () => {
    let response = await getAll({ filter: { "fields": { "changwatname": "true" }, "where": { "zonecode": "08" } } }, 'cchangwats');
    setChangwats(response.data);
  }
  const getDepartment = async (cw) => {
    let response = await getAll({ filter: { "fields": { "hos_id": "true", "hos_name": "true", "hos_fullname": "true" }, "where": { "province_name": cw } } }, 'hospitals');
    setDepartments(response.data);
  }
  useEffect(() => {
    getChangwat();
  }, []);

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
          value={validator.formElements.fullname.value}
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
          value={validator.formElements.position.value}
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
          value={validator.formElements.cid.value}
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
          value={validator.formElements.mobile.value}
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
          value={validator.formElements.email.value}
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
          value={validator.formElements.password.value}
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
          required
          options={changwats}
          getOptionSelected={(option, value) => value.changwatname === option.changwatname}
          getOptionLabel={(option) => option.changwatname || ''}
          onChange={(e, newValue) => {
            setChangwat((newValue) ? newValue.changwatname : '');
            setDepartment('');
            if (newValue !== null) { getDepartment(newValue.changwatname) }
          }}
          renderInput={(params) =>
            <TextField {...params}
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
          required
          options={departments}
          getOptionSelected={(option, value) => {
            return value === option
          }}
          getOptionLabel={(option) => option.hos_name || ''}
          value={department}
          onChange={(_, newValue) => {
            delete Object.assign(newValue, { 'hcode': newValue['hos_id'] })['hos_id'];
            setDepartment((newValue !== null) ? newValue : '')
          }}
          renderInput={(params) => <TextField {...params} label="หน่วยงาน" variant="outlined" />}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-primary btn-block" disabled={!validator.formValid}>ลงทะเบียน</button>
      </div>
    </div >
  }

  const onFormSubmit = (event) => {
    event.preventDefault();
    Object.entries(event.target.elements).forEach(([name, input]) => {
      if (input.type !== 'submit' && (input.type === 'text' || input.type === 'password')) {
        onElementChange(input);
      }
    });
    if (validator.formValid) {
      let param = {
        fullname: validator.formElements.fullname.value,
        position: validator.formElements.position.value,
        cid: validator.formElements.cid.value,
        mobile: validator.formElements.mobile.value,
        email: validator.formElements.email.value,
        password: validator.formElements.password.value,
        changwat: changwat,
        department: department
      }
      AuthService.register(param).then(
        (response) => {
          if (response.status === 200) {
            alert("ลงทะเบียนสำเร็จ รอผู้ดูแลระบบอนุมัติการใช้งาน");
            redirect.push("/login");
          }
        },
        (error) => { console.log(error) }
      );
    }
  };

  return (
    <div className="col-md-12">
      <div className={"card " + classes.containerCard}>
        <label htmlFor="caption" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>ลงทะเบียน</h3>
        </label>
        <Form className={classes.root} onSubmit={onFormSubmit} ref={form} autoComplete="new-password">
          {registerForm()}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Register;
