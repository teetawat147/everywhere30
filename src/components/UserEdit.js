/* eslint-disable no-unused-vars */

import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Form from "react-validation/build/form";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckButton from "react-validation/build/button";
import { useHistory } from "react-router-dom";
import { getAll, patch, create } from "../services/UniversalAPI";
import { getCurrentUser } from "../services/auth.service";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
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
  const [lookupchangwats, setLookUpchangwats] = useState([]);
  const [lookupdepartments, setLookUpDepartments] = useState([]);
  const [userData, setUserData] = useState({});
  const [{ disEmail, disPassword }, setDisabledState] = useState({
    disEmail: false,
    disPassword: false,
  });
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [getAmpur, setgetAmpur] = useState();

  const [open, setOpen] = React.useState(false);

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
    // console.log(userData);
    // console.log(x);
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

  const getchangwat = async () => {
    if (currentUser.user.role === "AdminR8") {
      let response = await getAll(
        {
          filter: {
            fields: { changwatname: "true" },
            where: { zonecode: "08" },
          },
          // filter: { fields: { changwatname: "true" }, where:{and: [{ zonecode: "08" },{ changwatname: currentUser.user.changwat }] }},
        },
        "cchangwats"
      );
      if (response.status === 200) {
        if (response.data) {
          if (response.data.length > 0) {
            // console.log(response.data)
            setLookUpchangwats(response.data);
          }
        }
      }
    } else {
      let response = await getAll(
        {
          // filter: { fields: { changwatname: "true" }, where: { zonecode: "08" } },
          filter: {
            fields: { changwatname: "true" },
            where: {
              and: [
                { zonecode: "08" },
                { changwatname: currentUser.user.changwat },
              ],
            },
          },
        },
        "cchangwats"
      );
      if (response.status === 200) {
        if (response.data) {
          if (response.data.length > 0) {
            // console.log(response.data)
            setLookUpchangwats(response.data);
          }
        }
      }
    }
  };

  const getDepartment = async (cw) => {
    if (currentUser.user.role === "AdminR8") {
      let response = await getAll(
        {
          filter: {
            fields: { hos_id: "true", hos_name: "true", hos_fullname: "true" },
            where: {
              and: [{ province_name: cw }, { hos_type_id: { neq: "5" } }],
            },
          },
        },
        "hospitals"
      );
      setLookUpDepartments(response.data);
    } else if (currentUser.user.role === "AdminChangwat") {
      let response = await getAll(
        {
          filter: {
            fields: { hos_id: "true", hos_name: "true", hos_fullname: "true" },
            where: {
              and: [
                { province_name: currentUser.user.changwat },
                { hos_type_id: { neq: "5" } },
              ],
            },
          },
        },
        "hospitals"
      );
      setLookUpDepartments(response.data);
    } else if (currentUser.user.role === "AdminHospital") {
      let response = await getAll(
        {
          filter: {
            fields: { hos_id: "true", hos_name: "true", hos_fullname: "true" },
            where: {
              and: [
                { province_name: currentUser.user.changwat },
                { hos_ampid: getAmpur },
                { hos_type_id: { neq: "1" } },
                { hos_type_id: { neq: "5" } },
              ],
            },
          },
        },
        "hospitals"
      );
      setLookUpDepartments(response.data);
    }
  };

  const userAmpur = async () => {
    let response = await getAll(
      {
        filter: {
          fields: {
            hos_id: "true",
            hos_name: "true",
            hos_fullname: "true",
            hos_ampid: "true",
          },
          where: {
            and: [
              { province_name: currentUser.user.changwat },
              { hos_id: currentUser.user.department.hcode },
            ],
          },
        },
      },
      "hospitals"
    );
    setgetAmpur(response.data[0].hos_ampid);
  };

  useEffect(() => {
    getchangwat();
    userAmpur();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    // console.log(props.location.state)
    if (typeof props.location.state !== "undefined") {
      if (typeof props.location.state.status !== "undefined") {
        if (
          Object.keys(props.location.state.status).length > 0 &&
          props.location.state.status !== "newadd"
        ) {
          setUserData(props.location.state.status);
        } else {
          setUserData({
            email: "",
            fullname: "",
            cid: "",
            mobile: "",
            password: "",
            department: null,
            position: "",
            changwat: "",
          });
        }
        if (typeof props.location.state.status.changwat !== "undefined") {
          getDepartment(props.location.state.status.changwat);
        }
      }
    }
  }, [props.location]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const getAutoDefaultValueChangwat = (x) => {
    let r = null;
    lookupchangwats.forEach((i) => {
      if (i.changwatname === x) {
        r = i;
      }
    });
    return r;
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    redirect.push("/userlist");
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
          {lookupchangwats.length > 0 && (
            <Autocomplete
              id="changwat"
              size="small"
              fullWidth
              options={lookupchangwats}
              defaultValue={getAutoDefaultValueChangwat(userData["changwat"])}
              getOptionSelected={(option, value) =>
                value.changwatname === option.changwatname
              }
              getOptionLabel={(option) => option.changwatname || ""}
              onChange={(e, newValue) => {
                let changwatName =
                  newValue != null ? newValue.changwatname : "";
                let x = userData;
                x["department"] = null;
                setUserData({ ...userData, ...x });

                if (changwatName !== "") {
                  getDepartment(changwatName);
                  x["changwat"] = changwatName;
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
          {/* {console.log(lookupdepartments)} */}
          {lookupdepartments.length > 0 && (
            <Autocomplete
              id="department"
              size="small"
              fullWidth
              options={lookupdepartments}
              getOptionSelected={(option, value) => {
                return value === option;
              }}
              getOptionLabel={(option) => option.hos_name || ""}
              value={userData["department"]}
              onChange={(_, newValue) => {
                delete Object.assign(newValue, { hcode: newValue["hos_id"] })[
                  "hos_id"
                ];
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
    if (typeof userData.RoleMapping !== "undefined") {
      // console.log(userData.RoleMapping)
      delete userData["RoleMapping"];
    }
    if (checkBtn.current.context._errors.length === 0) {
      if (isAddMode === "newadd") {
        create(userData, "teamusers").then(
          (response) => {
            if (response.status === 200) {
              alert("สำเร็จ");
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
        // console.log(userData);
        // delete userData["RoleMapping"];
        patch(userData["id"], userData, "teamusers").then(
          (response) => {
            if (response.status === 200) {
              setOpen(true);
              alert("สำเร็จ");
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
          <h3>
            {isAddMode === "newadd" ? "เพิ่มผู้ใช้งาน" : "แก้ไขผู้ใช้งาน"}
          </h3>
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
      <div className={classes.root}>
        <Snackbar open={open} autoHideDuration={1500} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            บันทึกเสร็จ
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
