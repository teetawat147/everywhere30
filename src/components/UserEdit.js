/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Form from "react-validation/build/form";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckButton from "react-validation/build/button";
// import { isEmail } from "validator";
import { useHistory } from "react-router-dom";
import * as AuthService from "../services/auth.service";
import UAPI from "../services/UniversalAPI";
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      width: "100%",
    },
    "& .MuiInputLabel-outlined": {
      zIndex: 1,
      transform: "translate(15px, 4px) scale(1)",
      pointerEvents: "none",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(15px, -18px) scale(0.75)",
    },
    // '@media(min - width: 576px)': {}
  },
  alertDanger: {
    color: "#ec0016",
    backgroundColor: "none",
    borderColor: "none",
    position: "relative",
    padding: "0",
    marginBottom: "1rem",
    border: "none",
    borderRadius: ".25rem",
  },
  alertSuccess: {
    color: "green",
    backgroundColor: "none",
    borderColor: "none",
    position: "relative",
    padding: "0",
    marginBottom: "1rem",
    border: "none",
    borderRadius: ".25rem",
  },
  containerCard: { maxWidth: "400px!important", padding: "40px 40px" },
}));

export default function UserEdit(props) {
  //const { id } = props.location.state.status;
  const isAddMode = props.location.state.status;
  console.log(props.location.state.status)
  //   const { id } = "uwyuwiow";
  const redirect = useHistory();
  const classes = useStyles();
  const form = useRef();
  const checkBtn = useRef();
  // const [successful, setSuccessful] = useState(false);
  // const [message, setMessage] = useState("");
  const [fullname, setFullname] = useState("");
  const [position, setPosition] = useState("");
  const [cid, setCid] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lookupchangewats, setLookUpChangewats] = useState([]);
  const [changewat, setChangewat] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [departmentI, setDepartmentI] = useState("");
  const [users, setUsers] = useState("");
  //{ "hos_name": "", "hos_fullname": "" }
  // const [{ fullname, cid, mobile, email, password }, setState] = useState({
  //   fullname: '', cid: '', mobile: '', email: '', password: ''
  // });
  const [{ disEmail, disPassword }, setDisabledState] = useState({
    disEmail: false,
    disPassword: false,
  });
  // const setLineInfo = () => {
  //   if (typeof props.lineInfo !== 'undefined') {
  //     if (props.lineInfo.email !== '' && props.lineInfo.password !== '') {
  //       setFullname(props.lineInfo.fullname);
  //       setEmail(props.lineInfo.email);
  //       setPassword(props.lineInfo.password);
  //       setDisabledState({ disEmail: true, disPassword: true });
  //     }
  //   }
  // }

  //   useEffect(() => {
  //     const setLineInfo = () => {
  //       if (typeof props.lineInfo !== 'undefined') {
  //         if (props.lineInfo.email !== '' && props.lineInfo.password !== '') {
  //           setFullname(props.lineInfo.fullname);
  //           setEmail(props.lineInfo.email);
  //           setPassword(props.lineInfo.password);
  //           setDisabledState({ disEmail: true, disPassword: true });
  //         }
  //       }
  //     }
  //     setLineInfo();
  //   }, [props.lineInfo]);

  const [inputError, setInputError] = useState({
    fullname: false,
    position: false,
    cid: false,
    mobile: false,
    email: false,
    password: false,
  });
  const [inputHelperText, setInputHelperText] = useState({
    fullname: "",
    position: "",
    cid: "",
    mobile: "",
    email: "",
    password: "",
  });
  const helperTextConfig = {
    fullname: [{ required: true, helperText: "กรุณาระบุ ชื่อ-สกุล" }],
    cid: [
      { required: true, helperText: "กรุณาระบุเลขบัตรประชาชน" },
      {
        length: true,
        minLength: 13,
        helperText: "ความยาวอย่างน้อย 13 ตัวอักษร",
      },
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
  };
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
  };
  const handleInputChange = (e, validate) => {
    let name = e.target.name;
    let value = e.target.value;
    switch (name) {
      case "fullname":
        setFullname(value);
        break;
      case "position":
        setPosition(value);
        break;
      case "cid":
        setCid(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
    //console.log(email);
    // if (required === true) {
    //   let inputErr = { ...inputError }
    //   if (value === "") {
    //     eval('inputErr.' + name + '=true');
    //     setInputError(inputErr);
    //     helperText(validate, name, true);
    //     // setInputHelperText('กรุณาระบุข้อมูล');
    //   } else {
    //     eval('inputErr.' + name + '=false');
    //     setInputError(inputErr);
    //     helperText(validate, name, false);
    //     // setInputHelperText('');
    //   }
    // }
  };
  const getTeamuser = async () => {
   
    let response = await UAPI.get(props.location.state.status, "teamusers");
    console.log(response.data);
    setFullname(response.data.fullname);
    setEmail(response.data.email);
    setCid(response.data.cid);
    setMobile(response.data.mobile);
    setPosition(response.data.position);
    setChangewat(response.data.changewat);
    setDepartment(response.data.department);
    // setDepartmentI(response.data.department.hos_name);
    
  };

  const getChangewat = async () => {
    let response = await UAPI.getAll(
      {
        filter: { fields: { changwatname: "true" }, where: { zonecode: "08" } },
      },
      "cchangwats"
    );
    console.log(response.data);
    setLookUpChangewats(response.data);
  };

  //   const setAutocompleteDefaultValue = (data) => {
  //     let r;
  //     // let data_value=data[key_name];
  //     // let data_lookUp=lookUp[key_config.input_select_source_name];
  //     if (data) {
  //       //console.log(data)
  //       if (typeof lookupchangewats != "undefined") {
  //         lookupchangewats.map((i, n) => {
  //           //console.log(i)
  //           if (i.changwatname === data) {
  //             r = i;
  //           }
  //           return r;
  //         });
  //       }
  //     }
  //     return r;
  //   };

  const getDepartment = async (cw) => {
    let response = await UAPI.getAll(
      {
        filter: {
          fields: { hos_name: "true", hos_fullname: "true" },
          where: { province_name: cw },
        },
      },
      "hospitals"
    );
    setDepartments(response.data);
  };
  useEffect(() => {
    if (isAddMode!=='newadd') {getTeamuser()};
    getChangewat();
  }, []);
  //console.log({users.fullname})
  //console.log(props.location.state);
  const simpleRegisterForm = () => {
    return (
      <div>
        <div className="form-group">
          <TextField
            id="fullname"
            name="fullname"
            label="ชื่อสกุล"
            type="text"
            size="small"
            variant="outlined"
            value={fullname}
            onChange={(e) => handleInputChange(e, ["required", "length"])}
            helperText={inputHelperText.fullname}
            error={inputError.fullname}
            required
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
            value={position}
            onChange={(e) => handleInputChange(e, ["required", "length"])}
            helperText={inputHelperText.position}
            error={inputError.position}
            required
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
            value={cid}
            onChange={(e) => handleInputChange(e, ["required", "length"])}
            helperText={inputHelperText.cid}
            error={inputError.cid}
            required
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
            value={mobile}
            onChange={(e) => handleInputChange(e, ["required", "length"])}
            helperText={inputHelperText.mobile}
            error={inputError.mobile}
            required
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
            autoComplete="new-password"
            value={email}
            onChange={(e) => handleInputChange(e, ["required", "length"])}
            helperText={inputHelperText.email}
            error={inputError.email}
            disabled={disEmail}
            required
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => handleInputChange(e, ["required", "length"])}
            helperText={inputHelperText.password}
            error={inputError.password}
            disabled={disPassword}
            // required
          />
        </div>
        <div className="form-group">
          {/* {console.log(lookupchangewats, lookupchangewats.find((option)=>option.changwatname===changewat), changewat)} */}
          {lookupchangewats.length > 0 && (
            <Autocomplete
              id="changewat"
              size="small"
              fullWidth
              required
              //   defaultValue={{ label: changewats, value: changewats }}
              // value={changewat}
              options={lookupchangewats}
              defaultValue={lookupchangewats.find(
                (f) => f.changwatname === changewat
              )}
              getOptionSelected={(option, value) =>
                value.changwatname === option.changwatname
              }
              getOptionLabel={(option) => option.changwatname || ""}
              onChange={(e, newValue) => {
                setChangewat(newValue ? newValue.changwatname : "");
                setDepartment("");
                // setDepartmentI('');
                if (newValue !== null) {
                  getDepartment(newValue.changwatname);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="จังหวัด" variant="outlined" />
              )}
            />
          )}
        </div>
        {/* <div>{changewat} ค่าchangewat</div> */}
        <div className="form-group">
          <Autocomplete
            id="department"
            size="small"
            fullWidth
            required
            options={departments}
            getOptionSelected={(option, value) => {
              // console.log(option, value);

              // if (value === option) { return value === option }
              return value === option;
            }}
            getOptionLabel={(option) => option.hos_name || ""}
            value={department}
            onChange={(_, newValue) => {
              // console.log(newValue);
              setDepartment(newValue !== null ? newValue : "");
            }}
            // inputValue={departmentI}
            // onInputChange={(_, newInputValue) => {
            //   // console.log(newInputValue);
            //   setDepartmentI((newInputValue) ? newInputValue : '')
            // }}
            renderInput={(params) => (
              <TextField {...params} label="หน่วยงาน" variant="outlined" />
            )}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-primary btn-block">แก้ไข</button>
        </div>
      </div>
    );
  };
  //   const lineRegisterForm = () => {};
  const handleRegister = (e) => {
    e.preventDefault();
    // console.log(e)
    // setMessage("");
    // setSuccessful(false);
    // form.current.validateAll();
    if (checkBtn.current.context._errors.length === 0) {
      console.log(changewat);

      console.log(department);

      //   AuthService.updateuser({
      //     fullname,
      //     position,
      //     cid,
      //     mobile,
      //     email,
      //     changewat,
      //     department
      //   }).then(
      //     (response) => {
      //       if (response.status === 200) {
      //         alert("สำเร็จ");
      //         redirect.push("/userlist");
      //       }
      //     //   console.log(response);
      //       // setMessage(response.data.message);
      //       // setSuccessful(true);
      //     },
      //     (error) => {
      //       const resMessage =
      //         (error.response &&
      //           error.response.data &&
      //           error.response.data.message) ||
      //         error.message ||
      //         error.toString();

      //       // setMessage(resMessage);
      //       // setSuccessful(false);
      //     }
      //   );
    }
  };

  return (
    <div className="col-md-12">
      <div className={"card " + classes.containerCard}>
        <label
          htmlFor="caption"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <h3>{isAddMode==='newadd' ? "Add User" : "Edit User"}</h3>
          {/* <h3>แก้ไข</h3> */}
        </label>
        <Form
          className={classes.root}
          onSubmit={handleRegister}
          ref={form}
          autoComplete="new-password"
        >
          {simpleRegisterForm()}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
}

// export default UserEdit;
