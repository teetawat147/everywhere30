import React, { useState, useRef } from "react";
import { makeStyles } from '@material-ui/core';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import TextField from '@material-ui/core/TextField';
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import * as AuthService from "../services/auth.service";
const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      width: '100%',
    },
    '& .MuiInputLabel-outlined': {
      zIndex: 1,
      transform: 'translate(15px, 10px) scale(1)',
      pointerEvents: 'none'
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(15px, -18px) scale(0.75)',
    }
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
  const classes = useStyles();
  const form = useRef();
  const checkBtn = useRef();
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [{ fullname, cid, mobile, email, password }, setState] = useState({
    fullname: '', cid: '', mobile: '', email: '', password: ''
  });
  const [inputError, setInputError] = useState({
    'fullname': false, 'cid': false, 'mobile': false, 'email': false, 'password': false
  });
  const [inputHelperText, setInputHelperText] = useState({
    fullname: '', cid: '', mobile: '', email: '', password: ''
  });
  const helperTextConfig = {
    'fullname': [
      { required: true, helperText: 'กรุณาระบุ ชื่อ-สกุล' }
    ],
    'cid': [
      { required: true, helperText: 'กรุณาระบุเลขบัตรประชาชน' },
      { length: true, minLength: 13, helperText: 'ความยาวอย่างน้อย 13 ตัวอักษร' }
    ],
    // 'mobile': [
    //   { required: true, helperText: 'กรุณาระบุข้อมูลเบอร์โทรศัพท์' }
    // ],
    // 'email': [
    //   { required: true, helperText: 'กรุณาระบุอีเมลล์' }
    // ],
    // 'password': [
    //   { required: true, helperText: 'กรุณาระบุรหัสผ่าน' }
    // ]
  }
  const helperText = (validate, name, enable) => {
    let config = { ...helperTextConfig };
    Object.keys(config).forEach(function (key) {
      console.log(key);
      Object.keys(config[key]).forEach(function (k) {
        console.log(config[key][k]);
        if (Object.keys(config[key][k])[0]) {
          console.log(Object.keys(config[key][k])[0]);
        }
      });
    });
    // setInputHelperText(config);
  }
  const handleInputChange = (e, validate) => {
    let required = (e.target.hasAttribute('required')) ? true : false;
    let name = e.target.name;
    let value = e.target.value;
    setState(prevState => ({ ...prevState, [name]: value }));
    if (required === true) {
      let inputErr = { ...inputError }
      if (value === "") {
        eval('inputErr.' + name + '=true');
        setInputError(inputErr);
        helperText(validate, name, true);
        // setInputHelperText('กรุณาระบุข้อมูล');
      } else {
        eval('inputErr.' + name + '=false');
        setInputError(inputErr);
        helperText(validate, name, false);
        // setInputHelperText('');
      }
    }

  }

  const required = (value) => {
    if (!value) {
      return (
        <div className={classes.alertDanger} role="alert">กรุณาระบุข้อมูล</div>
      );
    }
  };
  const validFullname = (value) => {
    if (value.length < 3 || value.length > 50) {
      return (
        <div className={classes.alertDanger} role="alert">
          ความยาว 3 ถึง 50 ตัวอักษร
        </div>
      );
    }
  };
  const validCid = (value) => {
    if (value.length != 13) {
      return (
        <div className={classes.alertDanger} role="alert">ความยาว 13 ตัวอักษร</div>
      );
    }
  };
  const validMobile = (value) => {
    if (value.length > 10) {
      return (
        <div className={classes.alertDanger} role="alert">ความยาวไม่เกิน 10 ตัวอักษร</div>
      );
    }
  };
  const validEmail = (value) => {
    if (!isEmail(value)) {
      return (
        <div className={classes.alertDanger} role="alert">
          อีเมลล์ไม่ถูกต้อง
        </div>
      );
    }
  };
  const validPassword = (value) => {
    if (value.length < 6 || value.length > 40) {
      return (
        <div className={classes.alertDanger} role="alert">
          ความยาว 6 ถึง 40 ตัวอักษร
        </div>
      );
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(fullname, email, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="col-md-12">
      <div className={"card " + classes.containerCard}>
        {/* <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        /> */}

        <label htmlFor="caption"><h3>ลงทะเบียน</h3></label>
        <Form className={classes.root} onSubmit={handleRegister} ref={form} autoComplete="new-password">
          {!successful && (
            <div>
              <div className="form-group">
                <TextField
                  id="fullname"
                  name="fullname"
                  label="ชื่อสกุล"
                  type="text"
                  variant="outlined"
                  value={fullname}
                  onChange={handleInputChange}
                  helperText={inputHelperText.fullname}
                  // validates={() => { return ['required', 'length'] }}
                  error={inputError.fullname}
                  required
                />
              </div>
              <div className="form-group">
                <TextField
                  id="cid"
                  name="cid"
                  label="หมายเลขประจำตัวประชาชน"
                  type="text"
                  variant="outlined"
                  value={cid}
                  onChange={(e) => handleInputChange(e, ['required', 'length'])}
                  helperText={inputHelperText.cid}
                  error={inputError.cid}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cid">หมายเลขโทรศัพท์</label>
                <Input
                  type="text"
                  className="form-control"
                  name="mobile"
                  value={mobile}
                  onChange={handleInputChange}
                  validations={[required, validMobile]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">อีเมลล์</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  autoComplete="new-password"
                  value={email}
                  onChange={handleInputChange}
                  validations={[required, validEmail]}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">รหัสผ่าน</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={handleInputChange}
                  validations={[required, validPassword]}
                />
              </div>
              <div className="form-group">
                <button className="btn btn-primary btn-block">ลงทะเบียน</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div className={successful ? classes.alertSuccess : classes.alertDanger} role="alert">
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Register;
