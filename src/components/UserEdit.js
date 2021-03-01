/* eslint-disable no-unused-vars */

import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Form from "react-validation/build/form";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckButton from "react-validation/build/button";
import { useHistory } from "react-router-dom";
import { getAll, patch, create } from "../services/UniversalAPI";

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
  const isAddMode = props.location.state.status;
  const redirect = useHistory();
  const classes = useStyles();
  const form = useRef();
  const checkBtn = useRef();
  const [lookupchangewats, setLookUpChangewats] = useState([]);
  const [lookupdepartments, setLookUpDepartments] = useState([]);
  const [userData, setUserData] = useState({});
  const [{ disEmail, disPassword }, setDisabledState] = useState({ disEmail: false, disPassword: false });

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
      // console.log(key);
      Object.keys(config[key]).forEach(function (k) {
        // console.log(config[key][k]);
        if (Object.keys(config[key][k])[0]) {
          // console.log(Object.keys(config[key][k])[0]);
        }
      });
    });
    // setInputHelperText(config);
  };
  const handleInputChange = (e, validate) => {
    let name = e.target.name;
    let value = e.target.value;
    let x = userData;
    console.log(userData);
    console.log(x);
    switch (name) {
      case "fullname":
        x["fullname"] = value;
        break;
      case "position":
        x["position"] = value;
        break;
      case "cid":
        x["cid"] = value;
        break;
      case "mobile":
        x["mobile"] = value;
        break;
      case "email":
        x["email"] = value;
        break;
      case "password":
        x["password"] = value;
        break;
      default:
        break;
    }
    setUserData({ ...userData, ...x });
  };

  const getChangewat = async () => {
    let response = await getAll(
      {
        filter: { fields: { changwatname: "true" }, where: { zonecode: "08" } },
      },
      "cchangwats"
    );

    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          setLookUpChangewats(response.data);
        }
      }
    }
  };

  const getDepartment = async (cw) => {
    let response = await getAll(
      {
        filter: {
          fields: { hos_id: "true", hos_name: "true", hos_fullname: "true" },
          where: { province_name: cw },
        },
      },
      "hospitals"
    );

    if (response.status === 200) {
      if (response.data) {
        if (response.data.length > 0) {
          setLookUpDepartments(response.data);
        }
      }
    }
  };
  useEffect(() => {
    getChangewat();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {


    if (typeof props.location.state !== "undefined") {
      if (typeof props.location.state.status !== "undefined") {
        if (
          Object.keys(props.location.state.status).length > 0 &&
          props.location.state.status !== "newadd"
        ) {
          setUserData(props.location.state.status);
        } else {
          setUserData({
            username: "",
            email: "",
            fullname: "",
            cid: "",
            mobile: "",
            password: "",
            department: null,
            position: "",
            changewat: "",
          });
        }
        if (typeof props.location.state.status.changewat !== "undefined") {
          getDepartment(props.location.state.status.changewat);
        }
      }
    }
  }, [props.location]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const getAutoDefaultValueChangwat = (x) => {
    let r = null;
    lookupchangewats.forEach((i) => {
      if (i.changwatname === x) {
        r = i;
      }
    });
    return r;
  };

  const getAutoDefaultValueDepartment = (x) => {
    let r = null;
    if (typeof x !== "undefined") {
      if (x) {
        if (lookupdepartments.length > 0) {
          // console.log(x)
          // console.log(lookupdepartments)
          lookupdepartments.forEach((i) => {
            if (i.hos_name === x.hos_name) {
              r = i;
              // console.log(i)
            }
          });
        }
      }
    }
    return r;
  };

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
            // value={fullname}
            value={userData["fullname"]}
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
            // value={position}
            value={userData["position"]}
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
            // value={cid}
            value={userData["cid"]}
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
            // value={mobile}
            value={userData["mobile"]}
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
            value={userData["email"]}
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
            // value={password}
            value={userData["password"]}
            onChange={(e) => handleInputChange(e, ["required", "length"])}
            helperText={inputHelperText.password}
            error={inputError.password}
            disabled={disPassword}
          // required
          />
        </div>
        <div className="form-group">
          {lookupchangewats.length > 0 && (
            <Autocomplete
              id="changewat"
              size="small"
              fullWidth
              required
              options={lookupchangewats}
              defaultValue={getAutoDefaultValueChangwat(userData["changewat"])}
              getOptionSelected={(option, value) =>
                value.changwatname === option.changwatname
              }
              getOptionLabel={(option) => option.changwatname || ""}
              onChange={(e, newValue) => {
                let x = userData;
                x["department"] = null;
                setUserData({ ...userData, ...x });

                if (newValue !== null) {
                  getDepartment(newValue.changwatname);
                  x["changewat"] = newValue.changwatname;
                  setUserData({ ...userData, ...x });
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="จังหวัด" variant="outlined" />
              )}
            />
          )}
        </div>
        <div className="form-group">
          {lookupdepartments.length > 0 && (
            <Autocomplete
              id="department"
              size="small"
              fullWidth
              required
              options={lookupdepartments}
              getOptionSelected={(option, value) => {
                return value === option;
              }}
              getOptionLabel={(option) => option.hos_name || ""}
              value={userData["department"]}
              onChange={(_, newValue) => {
                let x = userData;
                x["department"] = newValue;
                setUserData({ ...userData, ...x });
              }}
              renderInput={(params) => (
                <TextField {...params} label="หน่วยงาน" variant="outlined" />
              )}
            />
          )}
        </div>
        <div className="form-group">
          <button className="btn btn-primary btn-block">แก้ไข</button>
        </div>
      </div>
    );
  };
  const handleRegister = (e) => {
    e.preventDefault();
    if (checkBtn.current.context._errors.length === 0) {
      if (isAddMode === "newadd") {
        create(userData, "teamusers").then(
          (response) => {
            if (response.status === 200) {
              // alert("สำเร็จ");
              redirect.push("/userlist");
            }
          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();

          }
        );
      } else {
        patch(userData["id"], userData, "teamusers").then(
          (response) => {
            if (response.status === 200) {
              // alert("สำเร็จ");
              redirect.push("/userlist");
            }

          },
          (error) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();


          }
        );
      }
    }
  };

  return (
    <div className="col-md-12">
      <div className={"card " + classes.containerCard}>
        <label
          htmlFor="caption"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <h3>{isAddMode === "newadd" ? "เพิ่มผู้ใช้งาน" : "แก้ไขผู้ใช้งาน"}</h3>
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
